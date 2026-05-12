from uuid import UUID
from app.models.position import OpenPosition
from app.models.user import User
from app.schemas.apply import ApplicantPublic, ApplicantsPublic
from fastapi import APIRouter
from sqlmodel import col, select

from app.api.deps import CurrentUser, SessionDep, ensure_project_admin, get_project
from app.models.link import UserPositionLink


from .projects import router


router = APIRouter(prefix="/projects/{project_id}/applicants", tags=["applicants"]) # type: ignore


@router.get("/", response_model=ApplicantsPublic)
def list_applicants(
    session: SessionDep,
    user: CurrentUser,
    project_id: UUID,
) -> ApplicantsPublic:
    project = get_project(session, project_id)
    ensure_project_admin(session, project, user)

    query = (
        select(User, OpenPosition)
        .join(UserPositionLink, col(User.id) == UserPositionLink.user_id)
        .join(OpenPosition, col(UserPositionLink.position_id) == OpenPosition.id)
        .where(OpenPosition.project_id == project_id)
    )
    result = session.exec(query).all()

    applicants = [
        ApplicantPublic(
            user_id=user.id,
            name=user.name,
            last_name=user.last_name,
            profile_image=user.profile_image,
            position_id=position.id,
            position_title=position.title,
            position_description=position.description
        )
        for user, position in result
    ]
    return ApplicantsPublic(applicants=applicants)
