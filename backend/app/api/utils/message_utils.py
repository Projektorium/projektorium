from uuid import UUID
from app.models.message import Message
from app.schemas.message import MessagePublic, MessageCreate
from app.models.user import User
from sqlmodel import Session, String
from fastapi import HTTPException

def build_message_public(msg: Message, current_user: User) -> MessagePublic:
    """
    Buduje DTO MessagePublic na podstawie już istniejącego obiektu Message
    i aktualnie zalogowanego użytkownika (dla jego obrazka profilowego).
    Nie wykonuje żadnych operacji na bazie danych.
    """
    return MessagePublic(
        id=msg.id,
        sender=msg.sender_id,
        sender_name=msg.sender.name,
        sender_last_name=msg.sender.last_name,
        receiver=msg.receiver_id,
        receiver_name=msg.receiver.name,
        receiver_last_name=msg.receiver.last_name,
        message=msg.message,
        sender_profile_image=current_user.profile_image,
        receiver_profile_image=msg.receiver.profile_image,
        sent_at=msg.created_at
    )



def send_message(
    session: Session,
    sender_id: UUID,
    receiver_id: UUID,
    msg_str: str
    
) -> MessagePublic:
    """
    Creates a new message and returns its public representation.
    """
    # Ensure recipient exists
    receiver = session.get(User, receiver_id)
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found")

    # Create and persist message
    msg = Message(
        sender_id=sender_id,
        receiver_id=receiver_id,
        message=msg_str
    )
    session.add(msg)
    session.commit()
    session.refresh(msg)

    return build_message_public(msg, User(id=sender_id, profile_image=None))  # Pass current user for profile image