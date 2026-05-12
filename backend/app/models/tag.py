from typing import TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship

from .link import UserTagLink, ProjectTagLink, PositionTagLink
from .common import EmbeddingVector

if TYPE_CHECKING:
    from .user import User
    from .project import Project
    from .position import OpenPosition


class NormalizedTag(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)

    embedding: EmbeddingVector



class TagBase(SQLModel):
    name: str = Field(index=True, unique=True)

class Tag(TagBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    normalized_tag_id: int | None = Field(default=None, foreign_key="normalizedtag.id")
    normalized_tag: NormalizedTag = Relationship()

    users: list["User"] = Relationship(back_populates="tags", link_model=UserTagLink)
    projects: list["Project"] = Relationship(back_populates="tags", link_model=ProjectTagLink)
    positions: list["OpenPosition"] = Relationship(
        back_populates="tags",
        link_model=PositionTagLink
    )
