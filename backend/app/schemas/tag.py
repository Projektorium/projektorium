from sqlmodel import SQLModel

class TagPublic(SQLModel):
    name: str


class TagCreate(SQLModel):
    name: str


class TagSchema(SQLModel):
    id: int
    name: str