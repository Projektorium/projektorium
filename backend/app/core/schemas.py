from pydantic import BaseModel
from fastapi import HTTPException
from typing import Optional
# ----------- TOKEN ---------------------

class TokenData(BaseModel):
    id: str


class HTTPExceptionResponse(BaseModel):
    detail: str

    # class Config:
    #     json_schema_extra = {
    #         "example": {"detail": "Some error message"}
    #     }


class DetailedHTTPException(HTTPException):
    def __init__(
        self,
        status_code: int,
        loc: list[str],
        msg: str,
        error_type: str,
        headers: Optional[dict] = None
    ):
        """
        Custom HTTPException with detailed error information.
        """
        super().__init__(
            status_code=status_code,
            detail=[{
                "loc": loc,
                "msg": msg,
                "type": error_type
            }],
            headers=headers
        )