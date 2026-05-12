import uuid
from sqlmodel import SQLModel


class ApplyRequest(SQLModel):
    position_title: str
    position_description: str | None = None


class ParticipantPublic(SQLModel):
    user_id: uuid.UUID
    name: str
    last_name: str
    position_title: str | None
    position_description: str | None
    profile_image: str | None


class ApplicantPublic(ParticipantPublic):
    position_id: uuid.UUID

class ApplicantsPublic(SQLModel):
    applicants: list[ApplicantPublic]


class ParticipantsPublic(SQLModel):
    participants:    list[ParticipantPublic]