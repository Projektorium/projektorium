from uuid import UUID

from app.schemas.project import ProjectLike, ProjectPublic
from fastapi import APIRouter, Body, HTTPException, status
from sqlmodel import col, select

from app.api.deps import (
    SessionDep,
    CurrentUser,
    OptionalCurrentUser
)
from app.models.link import UserLikedProjectLink
from app.models.project import Project

# Schema for public representation of a liked project

router = APIRouter(prefix="/projects/likes", tags=["likes"])

@router.get("/", response_model=list[ProjectPublic])
def get_liked_projects(
    session: SessionDep,
    user: CurrentUser,
    skip: int = 0,
    limit: int = 50,
):

    projects = session.exec(select(Project)
                            .join(UserLikedProjectLink)
                            .where(UserLikedProjectLink.user_id == user.id)
                            .offset(skip)
                            .limit(limit)
    ).all()
    # Fetches all the liked projects from the db
    # projects = user.liked_projects[skip : skip + limit]

    return projects


@router.post("/status", response_model=list[ProjectLike])
def get_projects_like_info(session: SessionDep, user: OptionalCurrentUser, project_ids: list[UUID] = Body(...)):

    if not user or not project_ids:
        return [ProjectLike(project_id=id, is_liked=False) for id in project_ids]

    # Get set of IDs for users liked by this user
    liked_project_ids: set[UUID | None] = set()

    if project_ids:
        liked_links = session.exec(
            select(UserLikedProjectLink.project_id)
            .where(
                UserLikedProjectLink.user_id == user.id,
                col(UserLikedProjectLink.project_id).in_(project_ids)
            )
        ).all()

        liked_project_ids = set(liked_links)


    # Add is_liked flag to each project
    return [ProjectLike(project_id=id, is_liked=(id in liked_project_ids)) for id in project_ids]


@router.post("/{project_id}", status_code=status.HTTP_201_CREATED)
def like_project(
    project_id: UUID,
    session: SessionDep,
    user: CurrentUser,
):
    # Ensure project exists
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    existing = session.exec(
        select(UserLikedProjectLink)
        .where(
            UserLikedProjectLink.user_id == user.id,
            UserLikedProjectLink.project_id == project_id
        )
    ).first()

    if existing:
        return {"detail": "Project was already liked"}

    user.liked_projects.append(project)

    session.commit()
    return {"detail": "Project liked"}


@router.delete("/{project_id}", status_code=status.HTTP_200_OK)
def unlike_project(
    project_id: UUID,
    session: SessionDep,
    user: CurrentUser,
):
    project = session.get(Project, project_id)

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    existing = session.exec(
        select(UserLikedProjectLink)
        .where(
            UserLikedProjectLink.user_id == user.id,
            UserLikedProjectLink.project_id == project_id
        )
    ).first()

    if not existing:
        return {"detail": "Project was not liked to begin with"}

    session.delete(existing)
    session.commit()

    return {"detail": "Project was succesfully unliked"}