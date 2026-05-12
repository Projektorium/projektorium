from uuid import UUID
from fastapi import APIRouter, HTTPException, status
from sqlmodel import col, select, delete
from sqlalchemy.orm import selectinload

from app.api.deps import (
    SessionDep,
    CurrentUser,
    get_project,
    ensure_project_admin,
    is_project_admin,
)
from app.models.position import OpenPosition
from app.schemas.apply import ApplicantPublic
from app.models.link import (
    ProjectRights,
    UserProjectLink,
    UserPositionLink,
)
from app.core.schemas import HTTPExceptionResponse
# build message import
from app.api.utils.message_utils import send_message
from sqlmodel import Session
from app.models.project import Project

router = APIRouter(prefix="/positions/{position_id}",tags=["project-applications"])

def get_approve_message(project: Project, position: OpenPosition) -> str:
    message = f"""Twoja aplikacja do projektu **{project.title}**

na stanowisko **{position.title}** 

została **zaakceptowana**."""
    return message

def get_rejected_message(project: Project, position: OpenPosition) -> str:
    message = f"""Twoja aplikacja do projektu **{project.title}**

na stanowisko **{position.title}**

została **odrzucona**."""
    return message

def send_application_message(session: Session, sender_id: UUID, receiver_id: UUID, message: str):
    send_message(
        session,
        sender_id,
        receiver_id,
        message
    )


@router.post("/apply", response_model=ApplicantPublic)
def apply_to_project(
    position_id: UUID,
    session: SessionDep,
    user: CurrentUser,
) -> ApplicantPublic:

    position = session.get(OpenPosition, position_id)
    if not position:
        raise HTTPException(status_code=404, detail="Position not found")

    # ensure single link per user-project
    existing = session.exec(
        select(UserProjectLink)
        .where(
            UserProjectLink.user_id == user.id,
            UserProjectLink.project_id == position.project_id
        )
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Already a member")

    already = session.exec(
        select(UserPositionLink)
        .where(
            UserPositionLink.user_id == user.id,
            UserPositionLink.position_id == position_id,
        )
    ).first()

    if already:
        raise HTTPException(status_code=400, detail="Already applied or invited")

    link = UserPositionLink(
        user_id=user.id,
        position_id=position_id,
    )

    session.add(link)
    session.commit()
    session.refresh(link)

    return ApplicantPublic(
        user_id=link.user_id, # type: ignore
        position_id=link.position_id, # type: ignore
        name=link.applicant.name,
        last_name=link.applicant.last_name,
        position_title=position.title,
        position_description=position.description,
        profile_image=link.applicant.profile_image,
    )


@router.post("/applicants/{user_id}/approve", status_code=status.HTTP_204_NO_CONTENT)
def accept_application(
    user_id: UUID,
    position_id: UUID,
    session: SessionDep,
    current_user: CurrentUser,
):
    position = session.get(OpenPosition, position_id)
    if not position:
        raise HTTPException(status_code=404, detail="Position not found")

    project = get_project(session, position.project_id)
    ensure_project_admin(session, project, current_user)

    app_link = session.exec(
        select(UserPositionLink)
        .where(
            UserPositionLink.user_id == user_id,
            UserPositionLink.position_id == position_id,
        )
    ).first()

    if not app_link:
        raise HTTPException(status_code=404, detail="Application not found")

    # Ensure that the user is not already a member of the project
    existing_membership = session.exec(
        select(UserProjectLink)
        .where(
            UserProjectLink.user_id == user_id,
            UserProjectLink.project_id == project.id
        )
    ).first()


    if existing_membership:
        raise HTTPException(status_code=400, detail="Already a member")

    # Create a link for the accepted user
    membership = UserProjectLink(
        user_id=user_id,
        project_id=project.id,
        permission=ProjectRights.READ,
        position_title=position.title,
        position_description=position.description,
    )
    session.add(membership)
    # Remove user from the applicants on this position.
    session.delete(app_link)
    session.commit()
    
    send_application_message(session, current_user.id, user_id, get_approve_message(project, position))


@router.post("/applicants/{user_id}/reject", status_code=status.HTTP_204_NO_CONTENT)
def reject_application(
    user_id: UUID,
    position_id: UUID,
    session: SessionDep,
    current_user: CurrentUser
):
    position = session.get(OpenPosition, position_id)
    if not position:
        raise HTTPException(status_code=404, detail="Position not found")

    project = get_project(session, position.project_id)

    # Admin can reject applications for any user, or the user can withdraw their own application
    is_admin = is_project_admin(session, project, current_user)
    if not (is_admin or current_user.id == user_id):
        raise HTTPException(status_code=403, detail="Forbidden")

    app_link = session.exec(
        select(UserPositionLink)
        .where(
            UserPositionLink.user_id == user_id,
            UserPositionLink.position_id == position_id,
        )
    ).first()

    if not app_link:
        raise HTTPException(status_code=404, detail="Application not found")

    # Remove user from the applicants on this position.
    session.delete(app_link)
    session.commit()
    send_application_message(session, current_user.id, user_id, get_rejected_message(project, position))