from uuid import UUID

from app.core.embeddings import Embedder
from app.schemas.tag import TagSchema
from fastapi import APIRouter, HTTPException, status
import numpy as np
from sqlmodel import select
from sqlalchemy.orm import selectinload


from app.api.deps import (
    OptionalCurrentUser,
    SessionDep,
    CurrentUser,
    SpellCheckerDep,
    EmbedderDep,
    get_project,
    ensure_project_admin,
)
from app.api.utils.tag_utils import get_or_create_tags

from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectPublic, ProjectPublicWithPermissions, ProjectUpdate
from app.models.enums import ProjectRights
from app.models.link import (
    UserProjectLink,
)


from app.api.common_responses import COMMON_ERROR_RESPONSES


TITLE_EMBEDDING_WEIGHT = 0.3
TEXT_EMBEDDING_WEIGHT =  0.7


router = APIRouter(prefix="/projects", tags=["projects"], responses=COMMON_ERROR_RESPONSES) # type: ignore


def get_text_embedding(
    title: str,
    description: str | None,
    embedder: Embedder
) -> np.ndarray:
    title_embedding = embedder.encode(title)

    if description:
        description_embedding = embedder.encode(description)
        return (
            TITLE_EMBEDDING_WEIGHT * title_embedding +
            (1 - TITLE_EMBEDDING_WEIGHT) * description_embedding
        )
    else:
        return title_embedding


def get_embedding(text_embedding: np.ndarray, tag_embedding: np.ndarray | None) -> np.ndarray:
    if tag_embedding is not None:
        return (
            TEXT_EMBEDDING_WEIGHT * text_embedding +
            (1 - TEXT_EMBEDDING_WEIGHT) * tag_embedding
        )
    else:
        return text_embedding


def project_to_public(project : Project, permissions : int) -> ProjectPublicWithPermissions:
    return ProjectPublicWithPermissions(
        id=project.id,
        owner_id=project.owner_id,
        title=project.title,
        description=project.description,
        logo=project.logo,
        project_status=project.project_status,
        tags=[TagSchema.model_validate(tag) for tag in project.tags],
        permissions=permissions
    )


@router.get("/{project_id}", response_model=ProjectPublicWithPermissions)
def read_project(
    project_id: UUID,
    session: SessionDep,
    user: OptionalCurrentUser,
) -> ProjectPublic:
    """
    Retrieve a single project by ID, including its tags.
    """
    statement = (
        select(Project)
        .where(Project.id == project_id)
        .options(selectinload(Project.tags)) # type: ignore
    )
    project = session.exec(statement).one_or_none()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if user is None:
        return project_to_public(project, ProjectRights.READ)

    link = session.exec(select(UserProjectLink).where(UserProjectLink.project_id == project_id,
                                                      UserProjectLink.user_id == user.id)).one_or_none()
    if link is None:
        return project_to_public(project, ProjectRights.READ)

    return project_to_public(project, link.permission)


@router.post("/create/", response_model=ProjectPublicWithPermissions)
def create_project(
    project_in: ProjectCreate,
    session: SessionDep,
    spellChecker: SpellCheckerDep,
    embedder: EmbedderDep,
    current_user: CurrentUser,
):
    try:
        text_embedding = get_text_embedding(project_in.title, project_in.description, embedder)

        tags, mean_tags_embedding = get_or_create_tags(
            session, spellChecker, embedder, project_in.tags
        )

        embedding = get_embedding(text_embedding, mean_tags_embedding)

        # Create project with all required fields
        project = Project(
            owner_id=current_user.id,
            title=project_in.title,
            description=project_in.description or "",
            text_embedding=text_embedding,
            mean_tags_embedding=mean_tags_embedding,
            embedding=embedding,
            tags=tags
        )

        session.add(project)
        session.flush() # Flush to get access to project.id.

        link = UserProjectLink(
            user_id=current_user.id,
            project_id=project.id,
            permission=ProjectRights.ADMIN,
            position_title="Owner",
            position_description="Project owner",
        )

        session.add(link)
        session.commit()
        return project_to_public(project, ProjectRights.ADMIN)

    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create project: {str(e)}")


@router.patch("/{project_id}", response_model=ProjectPublic)
def update_project(
    project_id: UUID,
    project_in: ProjectUpdate,
    session: SessionDep,
    spellChecker: SpellCheckerDep,
    embedder: EmbedderDep,
    current_user: CurrentUser
):
    """
    Update an existing project.
    """
    project = get_project(session, project_id)
    ensure_project_admin(session, project, current_user)

    update_data = project_in.model_dump(exclude_unset=True)
    tags_data = update_data.pop("tags", None)


    # Track if we need to update the final embedding
    update_final_embedding = False

    if project_in.title or project_in.description:
        # Need to update text embedding
        update_final_embedding = True
        title = project_in.title or project.title
        description = project_in.description if project_in.description is not None else project.description


        project.text_embedding = get_text_embedding(title, description, embedder)

    # Set the project attributes based on the update data
    for attr, value in update_data.items():
        setattr(project, attr, value)

    # Update the tags if provided
    if tags_data is not None:
        update_final_embedding = True
        project.tags, project.mean_tags_embedding = get_or_create_tags(session, spellChecker, embedder, tags_data)

    if update_final_embedding:
        project.embedding = get_embedding(project.text_embedding, project.mean_tags_embedding)

    session.add(project)
    session.commit()
    session.refresh(project)
    return project_to_public(project, ProjectRights.ADMIN)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: UUID,
    session: SessionDep,
    current_user: CurrentUser
):
    """
    Delete a project.
    """
    project = get_project(session, project_id)
    ensure_project_admin(session, project, current_user)
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    session.delete(project)
    session.commit()