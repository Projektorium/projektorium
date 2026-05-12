from fastapi import APIRouter, status, HTTPException
from pydantic import ValidationError

from app import crud
from app.api.deps import SessionDep
from app.core.security import (
    validate_password, 
    sanitize_str
)
from app.core.schemas import DetailedHTTPException
from app.models.user import User
from app.schemas.user import UserCreate, UserPublic, UserRegister
router = APIRouter(prefix="/signup", tags=["signup"])


@router.post("/", response_model=UserPublic)
def signup_user(session: SessionDep, user_in: UserRegister) -> User:
    """
    Create new user without the need to be logged in.
    """

    user_in.name = sanitize_str(user_in.name)
    user_in.last_name = sanitize_str(user_in.last_name)

    # Validate password
    password_validation = validate_password(user_in.password)
    if password_validation:
        raise DetailedHTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            loc=["body", "password"],
            msg=password_validation,
            error_type="value_error.invalid_password"
        )

    # Check if user already exists
    user = crud.get_user_by_email(session=session, email=user_in.email)
    if user:
        raise DetailedHTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            loc=["body", "email"],
            msg="The user with this email already exists in the system",
            error_type="value_error.user_exists",
            headers={"input": user_in.email}
        )

    # Validate user input
    try:
        user_create = UserCreate.model_validate(user_in)
    except ValidationError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=exc.errors()
        )

    # Create user
    user = crud.create_user(session=session, user_create=user_create)
    return user