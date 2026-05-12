from datetime import datetime, timezone
from typing import Annotated, Any
import numpy as np
from pgvector.sqlalchemy import Vector
from sqlmodel import Column, Field, DateTime, func
from app.core.config import settings


class CreatedAtMixin:
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    # created_at: datetime = Field(
    #     default_factory=datetime.utcnow,
    #     sa_column=Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    # )


class TimestampMixin:
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

def get_zero_vector():
    return np.zeros(settings.EMBEDDING_SIZE)

EmbeddingVector = Annotated[Any, Field(default_factory=get_zero_vector,
                                       sa_type=Vector(settings.EMBEDDING_SIZE))] # type: ignore

PasswordStr = Annotated[str, Field(min_length=8, max_length=40)]

