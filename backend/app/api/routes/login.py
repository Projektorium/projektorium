from datetime import timedelta
from fastapi import APIRouter, status, Depends, Response, Request
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated

from app import crud
from app.api.deps import SessionDep, CurrentUser
from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    TokenType,
    verify_token,
    validate_password,
    sanitize_str,
)
from app.core.schemas import DetailedHTTPException
from app.models.user import Token as TokenModel
from app.schemas.user import UserPublic

router = APIRouter(prefix="/login", tags=["login"])


@router.post(
    "/",
    response_model=TokenModel,
)
def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: SessionDep
    # response: Response
) -> TokenModel:
    """
    Obtain access token using user credentials.
    """
    # User credentials validation
    credentials_exception = DetailedHTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        loc=["body", "username"],
        msg="Incorrect email or password",
        error_type="value_error.credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )

    # # Validate password complexity
    # password_validation = validate_password(form_data.password)
    # if password_validation:
    #     raise DetailedHTTPException(
    #         status_code=status.HTTP_400_BAD_REQUEST,
    #         loc=["body", "password"],
    #         msg=password_validation,
    #         error_type="value_error.invalid_password"
    #     )

    # Sanitize username (email)
    form_data.username = sanitize_str(form_data.username)

    user = crud.get_user_by_email(session=session, email=form_data.username)
    if not user:
        print("HEre 1")
        raise credentials_exception

    if not crud.verify_password(form_data.password, user.hashed_password):
        print("HEre 2")
        print(form_data.password)
        raise credentials_exception

    # Authenticate user
    authenticated = crud.authenticate(
        session=session,
        email=form_data.username,
        password=form_data.password
    )

    if not authenticated:
        raise credentials_exception

    # ACCESS TOKEN CREATION
    expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        str(user.id),
        expires_delta=expires
    )

    # REFRESH TOKEN CREATION
    # rexpires = timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
    # refresh_token = create_refresh_token(
    #     str(user.id),
    #     expires_delta=rexpires
    # )

    # Set the refresh token in an HTTP-only cookie
    # response.set_cookie(
    #     key="refresh_token",
    #     value=refresh_token,
    #     httponly=True,
    #     secure=True,  # Use True in production for HTTPS
    #     samesite="Lax",
    #     max_age=rexpires.total_seconds()  # Set cookie expiration
    # )

    return TokenModel(access_token=token)

@router.get("/test-token", response_model=UserPublic)
def test_token(
    current_user: CurrentUser
):
    """
    Test endpoint to return current authenticated user.
    """
    return current_user


@router.post("/refresh-token", response_model=TokenModel)
def refresh_access_token(
    request: Request,
    db: SessionDep
) -> TokenModel:
    """
    Refresh the access token using the refresh token stored in cookies.
    """
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise DetailedHTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            loc=["cookie", "refresh_token"],
            msg="Refresh token missing",
            error_type="value_error.token_missing"
        )

    user_data = verify_token(refresh_token, TokenType.REFRESH, db)
    if not user_data:
        raise DetailedHTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            loc=["cookie", "refresh_token"],
            msg="Invalid refresh token",
            error_type="value_error.token_invalid"
        )

    expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    new_access_token = create_access_token(
        str(user_data.id),
        expires_delta=expires
    )
    return TokenModel(access_token=new_access_token)


# TO-DO: Implement password recovery and reset password functionality