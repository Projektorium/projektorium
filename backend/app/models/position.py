from typing import TYPE_CHECKING
import uuid
from sqlmodel import Field, Relationship, SQLModel, Enum as SQLEnum

from .common import CreatedAtMixin
from .tag import Tag

from .link import PositionTagLink, UserPositionLink

if TYPE_CHECKING:
    from .project import Project


class PositionBase(SQLModel):
    title: str = Field(max_length=255)
    description: str | None = Field(default="", max_length=500)


class OpenPosition(PositionBase, CreatedAtMixin, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    project_id: uuid.UUID = Field(
        foreign_key="project.id", nullable=False
    )

    # Relationships
    project: "Project" = Relationship(back_populates="positions")

    tags: list["Tag"] = Relationship(
        back_populates="positions",
        link_model=PositionTagLink
    )
    application_links: list["UserPositionLink"] = Relationship(
        back_populates="position",
        cascade_delete=True
    )


