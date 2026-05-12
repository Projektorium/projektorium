from datetime import datetime, timedelta, timezone
from typing import Any, Optional
from enum import Enum

import jwt
from passlib.context import CryptContext

from app.core.config import settings
from sqlmodel import Session
from .schemas import TokenData
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from .schemas import DetailedHTTPException

import re

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ALGORITHM = "HS256"

class TokenType(str, Enum):
    ACCESS = "access"
    REFRESH = "refresh"


def create_token(
    subject: str | Any, expires_delta: timedelta, token_type: TokenType = TokenType.ACCESS
) -> str:
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode = {"exp": expire, "sub": str(subject), "token_type": token_type}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_access_token(subject: str | Any, expires_delta: timedelta) -> str:
    return create_token(subject, expires_delta, TokenType.ACCESS)


def create_refresh_token(subject: str | Any, expires_delta: timedelta) -> str:
    return create_token(subject, expires_delta, TokenType.REFRESH)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


from fastapi import HTTPException, status
# … other imports …

def validate_password(password: str) -> str | None:
    """
    Check password complexity:
        - at least 8 characters
        - one lowercase letter
        - one uppercase letter
        - one digit
        - one special character
        Returns an error message if invalid, otherwise None.
    """
    errors: list[str] = []
    if len(password) < 8:
        errors.append("at least 8 characters")
    if not any(c.islower() for c in password):
        errors.append("one lowercase letter")
    if not any(c.isupper() for c in password):
        errors.append("one uppercase letter")
    if not any(c.isdigit() for c in password):
        errors.append("one digit")
    # if not any(not c.isalnum() for c in password):
    #     errors.append("one special character")
    if errors:
        return "Password must contain " + ", ".join(errors)

    return None


def sanitize_str(value: str) -> str:
    """
    Strip out HTML tags (e.g. <br>, <script>…) and control characters.
    """
    # WITHOUT HTML SANITIZER:
    # 1) remove anything that looks like an HTML/XML tag
    no_tags = re.sub(r'<[^>]*>', '', value)
    # 2) drop non‑printable/control chars
    no_ctrl = re.sub(r'[\x00-\x1f\x7f()]', '', no_tags)
    # 3) collapse any whitespace (space, newline, tab) to single spaces
    return re.sub(r'\s+', ' ', no_ctrl).strip()

    # # 1) sanitize HTML (removes tags, dangerous attributes, etc.)
    # cleaned = _sanitizer.sanitize(value)
    # # 2) drop all Unicode control characters
    # no_ctrl = ''.join(ch for ch in cleaned if unicodedata.category(ch)[0] != "C")
    # # 3) collapse whitespace to single spaces
    # return re.sub(r"\s+", " ", no_ctrl).strip()


# https://github.com/igorbenav/FastAPI-boilerplate/blob/main/src/app/core/security.py
def verify_token(token: str, expected_token_type: TokenType, db: Session) -> TokenData | None:
    """Verify a JWT token and return TokenData if valid.

    Parameters
    ----------
    token: str
        The JWT token to be verified.
    db: Session
        Database session for performing database operations.

    Returns
    -------
    TokenData | None
        TokenData instance if the token is valid, None otherwise.
    """
    # is_blacklisted = crud_token_blacklist.exists(db, token=token)
    # if is_blacklisted:
    #     return None

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[ALGORITHM]
        )
    except ExpiredSignatureError:
        raise DetailedHTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            loc= ["cookie", "refresh_token"],
            msg= "Token expired, cannot refresh",
            error_type= "value_error.token_expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except InvalidTokenError:
        raise DetailedHTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            loc= ["cookie", "refresh_token"],
            msg= "Invalid token",
            error_type= "value_error.token_invalid",
            headers={"WWW-Authenticate": "Bearer"},
        )

    uid = payload.get("sub")
    token_type = payload.get("token_type")
    # soft‐fail: bad payload contents
    if uid is None or token_type != expected_token_type:
        return None

    return TokenData(id=uid)


