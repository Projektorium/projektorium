import asyncio
from contextlib import asynccontextmanager
from typing import AsyncGenerator
from sqlmodel import Session
from app.core.db import engine
from app.core.bm25 import get_project_bm25
from app.core.bm25 import get_user_bm25
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


@asynccontextmanager
async def get_db_session() -> AsyncGenerator[Session, None]:
    """Get a database session for background tasks."""
    session = Session(engine)
    try:
        yield session
    finally:
        session.close()


async def update_bm25_indices_task():
    while True:
        try:
            async with get_db_session() as session:
                logger.info("Updating BM25 indices...")

                # The idf updates are blocking so we run it in separate thread
                await asyncio.to_thread(get_project_bm25().update_idf, session)
                await asyncio.to_thread(get_user_bm25().update_idf, session)

                logger.info(f"Project BM25 updated - {get_user_bm25().total_docs} documents")
                logger.info(f"User BM25 updated - {get_project_bm25().total_docs} documents")
                logger.info("BM25 indices updated successfully")
                logger.info(f"Start Updating embeddings")
        except Exception as e:
            logger.error(f"Error updating BM25 indices: {e}")


        await asyncio.sleep(settings.BM_UPDATE)


async def start_background_tasks():
    asyncio.create_task(update_bm25_indices_task())
    logger.info("Background tasks started")
