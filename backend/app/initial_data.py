import logging

from app.models.user import User
from sqlmodel import SQLModel, Session, func, select, text

from app.core.engine import engine
from app.core.db import init_db
from app.core.config import settings
from app.utils.seed_db import seed_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init() -> None:
    with Session(engine) as session:
        init_db(session)
        user_count = session.exec(select(func.count()).select_from(User)).one()

        if settings.DEVELOP and user_count == 0:
            seed_db(session)


def main() -> None:
    logger.info("Creating initial data")
    init()
    logger.info("Initial data created")


if __name__ == "__main__":
    main()
