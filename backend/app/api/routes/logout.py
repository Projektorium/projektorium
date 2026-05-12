from fastapi import APIRouter, status, Depends, Response, Request

from app.api.deps import CurrentUser
from app.core.schemas import DetailedHTTPException

router = APIRouter(prefix="/logout", tags=["logout"])

@router.post("/", status_code=status.HTTP_200_OK, summary="User logout")
def logout(
    request: Request,
    response: Response,
    current_user: CurrentUser  # Ensures only authenticated users can access
) -> dict:
    """
    Logs out the user by removing the refresh token cookie.
    """
    # Retrieve the refresh token from cookies
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise DetailedHTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            loc=["cookie", "refresh_token"],
            msg="Token expired, cannot refresh",
            error_type="value_error.token_invalid",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Delete the refresh token cookie
    response.delete_cookie(
        key="refresh_token",
        httponly=True,
        secure=True,
        samesite="lax"
    )

    return {"message": "Logged out successfully"}
