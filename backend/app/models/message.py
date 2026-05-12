from typing import TYPE_CHECKING
import uuid
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .user import User

from .common import CreatedAtMixin


class Message(CreatedAtMixin, SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    message: str = Field(max_length=1500)
    sender_id: uuid.UUID = Field(foreign_key="user.id")
    receiver_id: uuid.UUID = Field(foreign_key="user.id")

    sender: "User" = Relationship(
        back_populates="outgoing_messages",
        sa_relationship_kwargs={
            "foreign_keys": "[Message.sender_id]",
        },
    )
    receiver: "User" = Relationship(
        back_populates="incoming_messages",
        sa_relationship_kwargs={
            "foreign_keys": "[Message.receiver_id]",
        },
    )
