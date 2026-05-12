import uuid
from sqlmodel import SQLModel


class PositionCreate(SQLModel):
    title: str
    description: str | None = None


class PositionUpdate(SQLModel):
    title: str | None = None
    description: str | None = None


class PositionSchema(SQLModel):
    id: uuid.UUID
    title: str
    description: str | None = None


class PositionResponse(SQLModel):
    positions: list[PositionSchema]


