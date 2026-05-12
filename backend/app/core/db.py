from sqlmodel import Session, create_engine, select, SQLModel, text

from app import crud
from app.core.config import settings
# from app.models import SiteUser, SiteUserCreate

from app.models.models import * # type: ignore

from .engine import engine


# make sure all SQLModel models are imported (app.models) before initializing DB
# otherwise, SQLModel might fail to initialize relationships properly
# for more details: https://github.com/fastapi/full-stack-fastapi-template/issues/28


def init_db(session: Session) -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next lines
    # from sqlmodel import SQLModel

    # Enable pgvector
    session.exec(text('CREATE EXTENSION IF NOT EXISTS vector')) # type: ignore
    session.commit()

    # This works because the models are already imported and registered from app.models
    SQLModel.metadata.create_all(engine)

    # user = session.exec(
    #     select(SiteUser).where(SiteUser.email == settings.FIRST_SUPERUSER)
    # ).first()
    # if not user:
    #     user_in = SiteUserCreate(
    #         email=settings.FIRST_SUPERUSER,
    #         password=settings.FIRST_SUPERUSER_PASSWORD,
    #         is_superuser=True,
    #     )
    #     user = crud.create_user(session=session, user_create=user_in)
