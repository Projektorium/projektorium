import uuid

from enum import Enum
from typing import TYPE_CHECKING

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel, Column, Enum as SQLEnum


if TYPE_CHECKING:
    from .project import Project
    from .message import Message
    from .tag import Tag



from .link import UserLikedProjectLink, UserProjectLink, UserTagLink, UserPositionLink, UserLikedUserLink
from .common import TimestampMixin, EmbeddingVector

# Thanks for explaining enum: https://shekhargulati.com/2025/01/12/postgresql-enum-types-with-sqlmodel-and-alembic/
class UserStatus(str, Enum):
    STUDENT = "Student"
    PHD_STUDENT = "PhD student"
    GRADUATE = "Graduate"
    GUEST = "Guest"

# Shared properties
class UserBase(SQLModel):
    name : str = Field(min_length=1, max_length=255)
    last_name : str = Field(min_length=1,max_length=255)
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_superuser: bool = False
    profile_image: str | None = Field(default=None)
    description: str | None = Field(default=None)
    status: UserStatus = Field(default=UserStatus.GUEST, sa_column=Column(SQLEnum(UserStatus)))


class UserSearchParams(SQLModel):
    mean_tag_embedding: EmbeddingVector
    description_embedding: EmbeddingVector
    embedding: EmbeddingVector

# Database model, database table inferred from class name
class User(
    TimestampMixin, # information about when the user was created and updated
    UserBase,
    UserSearchParams,
    table=True
):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str

    tags: list["Tag"] = Relationship(back_populates="users", link_model=UserTagLink)

    project_links: list["UserProjectLink"] = Relationship(back_populates="participant", cascade_delete=True)

    liked_projects: list["Project"] = Relationship(
        back_populates="liked_by",
        link_model=UserLikedProjectLink,
    )

    # Users that this user has liked
    liked_users: list["User"] = Relationship(
        back_populates="liked_by",
        link_model=UserLikedUserLink,
        sa_relationship_kwargs={
            # Primary join: join between "left table" (User) and the "junction table" (UserLikedUserLink)
            "primaryjoin": "User.id==UserLikedUserLink.user_id",
            # Secondary join between the "junction table" (UserLikedUserLink) and the right table (User)
            "secondaryjoin": "UserLikedUserLink.liked_user_id==User.id"
        }
    )

    # Users who have liked this user
    liked_by: list["User"] = Relationship(
        back_populates="liked_users",
        link_model=UserLikedUserLink,
        sa_relationship_kwargs={
            "primaryjoin": "User.id==UserLikedUserLink.liked_user_id",
            "secondaryjoin": "UserLikedUserLink.user_id==User.id"
        }
    )

    position_links: list["UserPositionLink"] = Relationship(
        back_populates="applicant",
        cascade_delete=True
    )

    outgoing_messages: list["Message"] = Relationship(
        back_populates="sender",
        sa_relationship_kwargs={
            "foreign_keys": "[Message.sender_id]",
        },
        cascade_delete=True
    )
    incoming_messages: list["Message"] = Relationship(
        back_populates="receiver",
        sa_relationship_kwargs={
            "foreign_keys": "[Message.receiver_id]",
        },
        cascade_delete=True
    )


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None

class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)
