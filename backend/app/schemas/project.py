import uuid

from sqlmodel import Field, SQLModel
from app.models.project import ProjectBase, ProjectStatus

from app.models.link import ProjectRights
from .tag import TagCreate, TagSchema


class ProjectCreate(ProjectBase):
    project_status: ProjectStatus = Field(default=ProjectStatus.ACTIVE)
    tags: list[TagCreate]


class ProjectUpdate(SQLModel):
    title: str | None = None
    description: str | None = None
    tags: list[TagCreate] | None = None
    project_status: ProjectStatus | None = None


class ProjectPublic(SQLModel):
    id: uuid.UUID
    owner_id: uuid.UUID
    title: str
    description: str | None
    logo: str | None
    project_status: ProjectStatus
    tags: list[TagSchema]

class ProjectPublicWithPermissions(ProjectPublic):
    permissions: int = ProjectRights.READ

class ProjectLike(SQLModel):
    project_id: uuid.UUID
    is_liked: bool

class ProjectsLike(SQLModel):
    projects: list[ProjectLike]

class ProjectsPublic(SQLModel):
    projects: list[ProjectPublic]
