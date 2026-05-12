from typing import TYPE_CHECKING
import uuid

from sqlmodel import Relationship, SQLModel, Field, Column, Enum as SQLEnum
from .enums import ProjectRights

if TYPE_CHECKING:
    from .project import Project
    from .user import User
    from .position import OpenPosition

from .common import TimestampMixin

class UserPositionLink(TimestampMixin, SQLModel, table=True):
    user_id: uuid.UUID | None = Field(
        default=None, foreign_key="user.id", primary_key=True)
    position_id: uuid.UUID | None = Field(
        default=None, foreign_key="openposition.id", primary_key=True)

    applicant: "User" = Relationship(back_populates="position_links")
    position: "OpenPosition" = Relationship(back_populates="application_links")


class UserProjectLink(TimestampMixin, SQLModel, table=True):
    user_id: uuid.UUID | None = Field(
        default=None, foreign_key="user.id", primary_key=True)
    project_id: uuid.UUID | None = Field(
        default=None, foreign_key="project.id", primary_key=True)

    permission: int = Field(
        default=ProjectRights.READ,
    )

    participant: "User" = Relationship(back_populates="project_links")
    project: "Project" = Relationship(back_populates="participant_links")

    position_title: str | None = Field(max_length=255, nullable=True)
    position_description: str | None = Field(max_length=500, nullable=True)


class UserLikedProjectLink(SQLModel, table=True):
    user_id: uuid.UUID | None = Field(
        default=None, foreign_key="user.id", primary_key=True)
    project_id: uuid.UUID | None = Field(
        default=None, foreign_key="project.id", primary_key=True)


class UserLikedUserLink(SQLModel, table=True):
    # `user_id`` liked `liked_user_id`
    user_id: uuid.UUID = Field(foreign_key="user.id", primary_key=True)
    liked_user_id: uuid.UUID = Field(foreign_key="user.id", primary_key=True)


class UserTagLink(SQLModel, table=True):
    user_id: uuid.UUID | None = Field(
        default=None, foreign_key="user.id", primary_key=True)
    tag_id: int | None = Field(
        default=None, foreign_key="tag.id", primary_key=True)


class ProjectTagLink(SQLModel, table=True):
    project_id: uuid.UUID | None = Field(
        default=None, foreign_key="project.id", primary_key=True)
    tag_id: int | None = Field(
        default=None, foreign_key="tag.id", primary_key=True)


class PositionTagLink(SQLModel, table=True):
    position_id: uuid.UUID | None = Field(
        default=None, foreign_key="openposition.id", primary_key=True
    )
    tag_id: int | None = Field(
        default=None, foreign_key="tag.id", primary_key=True
    )

