from fastapi import status
from app.core.schemas import HTTPExceptionResponse, DetailedHTTPException
from fastapi import HTTPException


FORBIDDEN = {
    status.HTTP_403_FORBIDDEN: {
        "model": HTTPExceptionResponse,
        "description": "Forbidden",
        "content": {
            "application/json": {
                "example": {"detail": "User is not project admin"}
            }
        },
    }
}

NOT_FOUND = {
    status.HTTP_404_NOT_FOUND: {
        "model": HTTPExceptionResponse,
        "description": "Resource not found",
        "content": {
            "application/json": {
                "example": {"detail": "Project not found"}
            }
        },
    }
}




COMMON_ERROR_RESPONSES = {**NOT_FOUND, **FORBIDDEN}