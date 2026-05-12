from typing import Annotated, Generator, Optional
from uuid import UUID
from app.core.bm25 import ProjectBestMatch, UserBestMatch, get_project_bm25, get_user_bm25
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError

from pydantic import ValidationError
from sqlmodel import Session, col, select
from sqlalchemy.sql.expression import literal


from app.core import security
from app.core.config import settings
from app.core.engine import engine
from app.core.embeddings import Embedder, get_embedder
from app.core.spell.spellCheker import SpellChecker, get_spell_checker


from app.models.user import TokenPayload, User
from app.models.project import Project
from app.models.link import ProjectRights, UserProjectLink


reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/login/access-token"
)

reusable_oauth2_optional = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/login/access-token",
    auto_error=False
)

def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_db)]
EmbedderDep = Annotated[Embedder, Depends(get_embedder)]
SpellCheckerDep = Annotated[SpellChecker, Depends(get_spell_checker)]
ProjectBMDep = Annotated[ProjectBestMatch, Depends(get_project_bm25)]
UserBMDep = Annotated[UserBestMatch, Depends(get_user_bm25)]


TokenDep = Annotated[str, Depends(reusable_oauth2)]

def check_token(
    token: str
) -> TokenPayload:
    payload = jwt.decode(
        token,
        settings.SECRET_KEY,
        algorithms=[security.ALGORITHM]
    )
    return TokenPayload(**payload)


def get_current_user(
    session: SessionDep,
    token: TokenDep
) -> User:
    try:
        token_data = check_token(token)
    except (InvalidTokenError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials"
        )
    user = session.get(User, token_data.sub)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

CurrentUser = Annotated[User, Depends(get_current_user)]


def get_current_user_optional(
    session: SessionDep,
    token: str | None = Depends(reusable_oauth2_optional)
) -> User | None:
    if not token:
        return None
    try:
        token_data = check_token(token)
    except (InvalidTokenError, ValidationError):
        # Instead of raising an exception, we return None
        return None

    user = session.get(User, token_data.sub)
    return user

OptionalCurrentUser = Annotated[Optional[User], Depends(get_current_user_optional)]


def get_current_active_superuser(
    current_user: CurrentUser
) -> User:
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    return current_user


def get_project(session: Session, project_id: UUID) -> Project:
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


def is_project_admin(session: Session, project: Project, current_user: User) -> bool:
    stmt = (
        select(UserProjectLink)
        .where(
            UserProjectLink.user_id == current_user.id,
            UserProjectLink.project_id == project.id,
        )
        .filter(col(UserProjectLink.permission).op("&")(literal(ProjectRights.ADMIN)) == ProjectRights.ADMIN)
    )
    link = session.exec(stmt).first()
    return bool(link)


def ensure_project_admin(session: Session, project: Project, current_user: User) -> None:
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    # Check if current_user is admin
    is_admin = is_project_admin(session, project, current_user)
    if not is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User is not project admin")


