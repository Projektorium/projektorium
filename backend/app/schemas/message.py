import datetime
import uuid
from sqlmodel import Field, SQLModel


class MessageCreate(SQLModel):
    message: str = Field(..., max_length=1500, description="Content of the message")


class MessagePublic(SQLModel):
    id: uuid.UUID
    sender: uuid.UUID
    sender_name: str
    sender_last_name: str
    receiver: uuid.UUID
    receiver_name: str
    receiver_last_name: str
    message: str
    sender_profile_image: str | None
    receiver_profile_image: str | None
    sent_at: datetime.datetime