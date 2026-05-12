from datetime import date
from enum import Enum
import uuid

from typing import TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship, Column, Enum as SQLEnum

from .link import UserLikedProjectLink, UserProjectLink, ProjectTagLink
from .common import TimestampMixin, EmbeddingVector
from .tag import Tag


if TYPE_CHECKING:
    from .user import User
    from .attachment import Attachment
    from .publication import Publication
    from .position import OpenPosition


class ProjectStatus(Enum):
    ACTIVE = "Active"
    RECRUITMENT = "Recruitment"
    INACTIVE = "Inactive"
    PRIVATE = "Private"


class ProjectBase(SQLModel):
    title: str = Field(max_length=255)
    description: str | None = Field(default="", max_length=1500)
    project_status: ProjectStatus = Field(default=ProjectStatus.ACTIVE,
                                          sa_column=Column(SQLEnum(ProjectStatus)))


class ProjectSearchParams(SQLModel):
    mean_tags_embedding: EmbeddingVector
    text_embedding: EmbeddingVector
    embedding: EmbeddingVector

class Project(
    TimestampMixin, # Information about when the project was created and updated
    ProjectBase,
    ProjectSearchParams,
    table=True
):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    logo: str | None = Field(default=None)
    owner_id: uuid.UUID = Field(..., foreign_key="user.id")

    tags: list["Tag"] = Relationship(back_populates="projects", link_model=ProjectTagLink)

    participant_links: list["UserProjectLink"] = Relationship(back_populates="project", cascade_delete=True)
    liked_by: list["User"] = Relationship(
        back_populates="liked_projects",
        link_model=UserLikedProjectLink,
    )

    attachments: list["Attachment"] = Relationship(back_populates="project", cascade_delete=True)
    publications: list["Publication"] = Relationship(back_populates="project", cascade_delete=True)

    positions: list["OpenPosition"] = Relationship(back_populates="project", cascade_delete=True)
