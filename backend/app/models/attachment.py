from typing import TYPE_CHECKING
import uuid

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .project import Project

class Attachment(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    project_id: uuid.UUID | None = Field(default=None, foreign_key="project.id")
    description: str | None = Field(default=None, max_length=500)
    file: str | None = Field(default=None, max_length=255)

    project: "Project" = Relationship(back_populates="attachments")
