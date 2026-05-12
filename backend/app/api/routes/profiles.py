from uuid import UUID
import os

from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
import numpy as np
from sqlmodel import col, select
from sqlalchemy.orm import selectinload

from app.models.user import User
from app.models.project import Project
from app.models.link import UserProjectLink

from app.schemas.user import UserPublic, UserUpdateMe
from app.schemas.project import ProjectPublic, ProjectsPublic


from app.api.deps import (
    SessionDep,
    SpellCheckerDep,
    EmbedderDep,
    CurrentUser,
)
from app.api.utils.image_utils import save_image
from app.api.utils.tag_utils import get_or_create_tags

from app.core.config import ProfileImageSettings as IMG_SETTINGS

router = APIRouter(prefix="/profiles", tags=["profiles"])


USER_DESCRIPTION_WEIGHT = 0.2



def get_user_embedding(
    description_embedding: np.ndarray,
    tag_embedding: np.ndarray | None
) -> np.ndarray:
    """Calculate final user embedding from description and tag embeddings."""
    if tag_embedding is not None:
        return (
            USER_DESCRIPTION_WEIGHT       * description_embedding +
            (1 - USER_DESCRIPTION_WEIGHT) * tag_embedding
        )
    else:
        return description_embedding


@router.get("/me", response_model=UserPublic)
def read_me(user: CurrentUser):
    return user


@router.get("/{profile_id}", response_model=UserPublic)
def read_profile(
    profile_id: UUID,
    session: SessionDep
) -> User:
    statement = (
        select(User)
        .where(User.id == profile_id)
        .options(selectinload(User.tags)) # type: ignore
    )
    user = session.exec(statement).one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="Profile not found")
    return user

@router.patch("/{profile_id}", response_model=UserPublic)
def update_profile(
    profile_id: UUID,
    profile_in: UserUpdateMe,
    session: SessionDep,
    spellChecker: SpellCheckerDep,
    embedder: EmbedderDep,
    current_user: CurrentUser
):
    user = session.get(User, profile_id)
    if not user:
        raise HTTPException(status_code=404, detail="Profile not found")

    # Only allow the user to edit their own profile or if they are a superuser
    if current_user.id != profile_id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not allowed to edit this profile")

    # collect only fields that were passed
    update_data = profile_in.model_dump(exclude_unset=True)
    tags_data = update_data.pop("tags", None)

    # set all other fields
    for key, value in update_data.items():
        setattr(user, key, value)

    if profile_in.description:
        user.description_embedding = embedder.encode(profile_in.description)

    # handle tags via the helper
    if tags_data is not None:
        user.tags, user.mean_tag_embedding = get_or_create_tags(session, spellChecker, embedder, tags_data)


    user.embedding = get_user_embedding(user.description_embedding, user.mean_tag_embedding)

    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@router.get("/{user_id}/projects", response_model=ProjectsPublic, summary="Get all projects the user is a member of")
def read_user_projects(
    user_id: UUID,
    session: SessionDep,
) -> ProjectsPublic:
    # if current_user.id != user_id and not current_user.is_superuser:
    #     raise HTTPException(status_code=403, detail="Forbidden")

    stmt = (
        select(Project)
        .join(UserProjectLink, col(UserProjectLink.project_id) == col(Project.id))
        .where(
            UserProjectLink.user_id == user_id,
        )
        .options(selectinload(Project.tags)) # type: ignore
    )
    projects = session.exec(stmt).all()

    projects_public = [
        ProjectPublic.model_validate(project, from_attributes=True)
        for project in projects
    ]

    return ProjectsPublic(projects=projects_public)


@router.post("/{profile_id}/image", response_model=UserPublic)
async def upload_profile_image(
    profile_id: UUID,
    session: SessionDep,
    current_user: CurrentUser,
    file: UploadFile = File(...)
):
    # Authentication & Authorization
    if current_user.id != profile_id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not allowed to edit this profile")

    user = session.get(User, profile_id)
    if not user:
        raise HTTPException(status_code=404, detail="Profile not found")

    # Remove old image
    if user.profile_image:
        old_filename = os.path.basename(user.profile_image)
        old_path = IMG_SETTINGS.UPLOAD_DIR / old_filename
        if old_path.exists():
            try:
                old_path.unlink()
            except Exception:
                pass

    # Save and verify new image
    unique_name = await save_image(file)

    # Update user record
    user.profile_image = f"/api/v1/profiles/media/profile_images/{unique_name}"
    user.embedding = get_user_embedding(user.description_embedding, user.mean_tag_embedding)
    session.add(user)
    session.commit()
    session.refresh(user)

    return user


@router.get("/media/profile_images/{filename}", response_class=FileResponse)
async def get_profile_image(filename: str):
    """
    Public access to profile images.
    """
    # Sanitize filename to prevent path traversal
    safe_name = os.path.basename(filename)
    if safe_name != filename:
        raise HTTPException(status_code=400, detail="Invalid filename")

    file_path = IMG_SETTINGS.UPLOAD_DIR / safe_name
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="Image not found")

    # Determine MIME
    ext = file_path.suffix.lower()
    media_type = "image/jpeg" if ext in {".jpg", ".jpeg"} else "image/png"

    # Security headers
    headers = {
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=3600",  # clients can cache
    }
    return FileResponse(path=str(file_path), media_type=media_type, headers=headers)

