from typing import Any
from sqlmodel import Session, select
from .BestMatch import BestMatch
from app.models.user import User


class UserBestMatch(BestMatch):
    """BM25 implementation for User search."""
    
    def get_document_text(self, doc: User) -> str:
        """Extract searchable text from a User."""
        parts = []
        if doc.description:
            parts.append(doc.description)
        if doc.tags:
            parts.extend(tag.name for tag in doc.tags)
        return ' '.join(parts)

    def _update_idf_internal(self, session: Session) -> tuple[dict[str, float], float, int]:
        users = session.exec(select(User)).all()
        return self._compute_idf_from_documents(users)

    def compute_bm25_score(self, query: str, document: User) -> float:
        return super().compute_bm25_score(query, document)

    def compute_self_bm25_score(self, document: User) -> float:
        return super().compute_self_bm25_score(document)

user_bm25 = UserBestMatch()


def get_user_bm25() -> UserBestMatch:
    return user_bm25