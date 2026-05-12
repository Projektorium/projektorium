from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import SQLModel, Field, select, Session
from sqlalchemy.orm import selectinload

from app.api.deps import (
    SessionDep,
    CurrentUser
)
from app.models.message import Message
from app.schemas.message import MessagePublic, MessageCreate
from app.models.user import User
from app.api.utils.message_utils import build_message_public, send_message as create_message

# Define router
router = APIRouter(prefix="/messages", tags=["messages"])



@router.post("/{receiver_id}", response_model=MessagePublic, status_code=status.HTTP_201_CREATED)
async def send_message(
    receiver_id: UUID,
    msg_in: MessageCreate,
    session: SessionDep,
    current_user: CurrentUser,
):
    return create_message(session, current_user.id, receiver_id, msg_in.message)

# List sent messages
@router.get("/sent/", response_model=List[MessagePublic])
async def get_sent_messages(
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, gt=0, le=100)
):
    statement = select(Message).where(Message.sender_id == current_user.id).options(
        selectinload(Message.receiver) # type: ignore
    )
    results = session.exec(statement.offset(skip).limit(limit)).all()
    return [
        build_message_public(m, current_user)
        for m in results
    ]

# List received messages
@router.get("/received/", response_model=List[MessagePublic])
async def get_received_messages(
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, gt=0, le=100)
):
    statement = select(Message).where(Message.receiver_id == current_user.id).options(
        selectinload(Message.sender) # type: ignore
    )
    results = session.exec(statement.offset(skip).limit(limit)).all()
    return [
        build_message_public(m, current_user)
        for m in results
    ]
