import uuid
from sqlmodel import SQLModel



class AttachmentPublic(SQLModel):
    id: uuid.UUID
    project_id: uuid.UUID | None = None
    description: str | None = None
    file: str | None = None

