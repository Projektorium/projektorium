from uuid import UUID
from app.schemas.apply import ApplyRequest, ParticipantPublic, ParticipantsPublic
from fastapi import APIRouter, HTTPException, status
from sqlmodel import select
from app.api.deps import CurrentUser, SessionDep, ensure_project_admin, get_project, is_project_admin
from app.models.link import UserProjectLink

from .projects import router


router = APIRouter(prefix="/projects/{project_id}/participants", tags=["participants"]) # type: ignore


def get_participant_link(session, project_id, user_id):
    project = get_project(session, project_id)
    link = session.exec(
        select(UserProjectLink)
        .where(
            UserProjectLink.project_id == project.id,
            UserProjectLink.user_id == user_id,
        )
    ).first()

    if not link:
        raise HTTPException(status_code=404, detail="Participant not found")

    return project, link


@router.get("/", response_model=ParticipantsPublic)
def list_participants(
    session: SessionDep,
    project_id: UUID,
):
    project = get_project(session, project_id)

    participants = [
        ParticipantPublic(
            user_id=link.user_id, # type: ignore
            name=link.participant.name,
            last_name=link.participant.last_name,
            position_title=link.position_title,
            position_description=link.position_description,
            profile_image=link.participant.profile_image,
        )
        for link in project.participant_links
    ]

    return ParticipantsPublic(participants=participants)


@router.patch("/{user_id}", response_model=ParticipantPublic)
def update_participant_position(
    project_id: UUID,
    user_id: UUID,
    pos_in: ApplyRequest,
    session: SessionDep,
    current_user: CurrentUser
) -> ParticipantPublic:
    project, link = get_participant_link(session, project_id, user_id)
    ensure_project_admin(session, project, current_user)

    link.position_title = pos_in.position_title
    link.position_description = pos_in.position_description
    session.commit()

    return ParticipantPublic(
        user_id=user_id,
        name=link.participant.name,
        last_name=link.participant.last_name,
        position_title=link.position_title,
        position_description=link.position_description,
        profile_image=link.participant.profile_image
    )


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_participant(
    project_id: UUID,
    user_id: UUID,
    session: SessionDep,
    current_user: CurrentUser
):
    project, link = get_participant_link(session, project_id, user_id)

    # Admin can remove any participant, or the user can remove themselves
    is_admin = is_project_admin(session, project, current_user)
    if not (is_admin or current_user.id == user_id):
        raise HTTPException(status_code=403, detail="Forbidden")

    # Remove the participant from the project
    session.delete(link)
    session.commit()