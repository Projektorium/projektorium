from uuid import UUID
from app.schemas.project import ProjectPublic
from app.schemas.user import UserPublic
from sqlmodel import Session, col
from app.models.project import Project
from app.models.user import User
from app.models.link import UserLikedProjectLink, UserLikedUserLink
from sqlmodel import select
from sqlalchemy import in_


def add_like_status_to_projects(
    session: Session,
    projects: list[ProjectPublic],
    user: User | None = None,
) -> list[ProjectPublic]:
    """
    Add is_liked flag to a list of projects based on user likes.
    """
    if not user:
        return projects

    # Get set of IDs for projects liked by this user
    liked_project_ids: set[UUID | None] = set()

    if projects:
        project_ids = [p.id for p in projects]
        liked_links = session.exec(
            select(UserLikedProjectLink.project_id)
            .where(
                UserLikedProjectLink.user_id == user.id,
                col(UserLikedProjectLink.project_id).in_(project_ids)
            )
        ).all()

        liked_project_ids = set(liked_links)

    for project in projects:
        if project.id in liked_project_ids:
            project.is_liked = True
    # Add is_liked flag to each project
    return projects

def add_like_status_to_users(
    session: Session,
    users: list[UserPublic],
    user: User | None = None,
) -> list[UserPublic]:
    """
    Add is_liked flag to a list of projects based on user likes.
    """
    if not user:
        return users

    liked_users_ids: set[UUID | None] = set()

    if users:
        users_ids = [u.id for u in users]
        liked_links = session.exec(
            select(UserLikedUserLink.liked_user_id)
            .where(
                UserLikedUserLink.user_id == user.id,
                col(UserLikedUserLink.liked_user_id).in_(users_ids)
            )
        ).all()

        liked_users_ids = set(liked_links)

    for u in users:
        if u.id in liked_users_ids:
            u.is_liked = True
    # Add is_liked flag to each project
    return users