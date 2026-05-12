from typing import Any
from app.models.project import Project
from sqlmodel import Session, select
from .BestMatch import BestMatch

class ProjectBestMatch(BestMatch):
    """BM25 implementation for Project search."""
    
    def get_document_text(self, doc: Project) -> str:
        """Extract searchable text from a Project."""
        parts = []
        if doc.title:
            parts.append(doc.title)
        if doc.description:
            parts.append(doc.description)
        if doc.tags:
            parts.extend(tag.name for tag in doc.tags)
        return ' '.join(parts)

    def _update_idf_internal(self, session: Session) -> tuple[dict[str, float], float, int]:
        """Update IDF values for projects."""
        projects = session.exec(select(Project)).all()
        return self._compute_idf_from_documents(projects)

    def compute_bm25_score(self, query: str, document: Project) -> float:
        return super().compute_bm25_score(query, document)

    def compute_self_bm25_score(self, document: Project) -> float:
        return super().compute_self_bm25_score(document)



project_bm25 = ProjectBestMatch()

def get_project_bm25() -> ProjectBestMatch:
    return project_bm25