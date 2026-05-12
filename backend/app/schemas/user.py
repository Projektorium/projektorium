import uuid

from pydantic import EmailStr
from sqlmodel import Field, SQLModel
from .tag import TagSchema, TagCreate

from app.models.common import PasswordStr
from app.models.user import UserBase, UserStatus






# Properties to receive via API on creation
class UserCreate(UserBase):
    password: PasswordStr
    status: UserStatus = Field(default=UserStatus.GUEST)


class UserRegister(SQLModel):
    name : str = Field(max_length=255)
    last_name : str = Field(max_length=255)
    email: EmailStr = Field(max_length=255)
    password: PasswordStr


# Properties to receive via API on update, all are optional
class UserUpdateSecurity(UserBase):
    email: EmailStr | None # type: ignore
    password: PasswordStr | None = None


class LoginData(SQLModel):
    username: EmailStr
    password: PasswordStr


class UserUpdateMe(SQLModel):
    name : str | None = None
    last_name : str | None = None
    description: str | None = None
    tags: list[TagCreate] | None = None



class UpdatePassword(SQLModel):
    current_password: PasswordStr
    new_password: PasswordStr


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID
    is_liked: bool = False
    tags: list[TagSchema]

class UsersPublic(SQLModel):
    users: list[UserPublic]

class UserLike(SQLModel):
    user_id: uuid.UUID
    is_liked: bool

# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None

class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)
