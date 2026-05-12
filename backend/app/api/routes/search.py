from typing import Any, Protocol, Sequence, Type, TypeVar
from uuid import UUID
from app.api.deps import CurrentUser, EmbedderDep, OptionalCurrentUser, SessionDep, ProjectBMDep, UserBMDep
from app.core.bm25 import BestMatch
from app.models.common import EmbeddingVector
from app.models.project import Project
from app.schemas.project import ProjectPublic, ProjectsPublic
from app.models.user import User
from app.schemas.user import UserPublic, UsersPublic
from fastapi import APIRouter, Path, Query
import numpy as np
from sqlmodel import func, select
from app.api.deps import get_project

router = APIRouter(prefix="/search", tags=["search"]) # type: ignore


alpha = 0.6
USER_WEIGHT = 0.3

SEARCH_NUMBER = 40

class EmbeddingEntity(Protocol):
    embedding: EmbeddingVector

T = TypeVar('T', bound=EmbeddingEntity)
P = TypeVar('P')
R = TypeVar('R')


def hybrid_rank(candidates: Sequence[T], bert_scores: np.ndarray, bm25_scores: np.ndarray,
                alpha: float, limit: int) -> list[T]:
    """Normalize scores, combine them, and return top ranked projects."""

    if bert_scores.size > 1 and bert_scores.max() != bert_scores.min():
        bert_scores = (bert_scores - bert_scores.min()) / (bert_scores.max() - bert_scores.min())
    else:
        bert_scores = np.ones_like(bert_scores)

    if bm25_scores.size > 1 and bm25_scores.max() != bm25_scores.min():
        bm25_scores = (bm25_scores - bm25_scores.min()) / (bm25_scores.max() - bm25_scores.min())
    else:
        bm25_scores = np.ones_like(bm25_scores)

    combined_scores = alpha * bert_scores + (1 - alpha) * bm25_scores

    rank_indices = combined_scores.argsort()[::-1]
    return [candidates[idx] for idx in rank_indices[:limit]]


def cosine_similarity(A: np.ndarray, B: np.ndarray) -> float:
    norm_A = np.linalg.norm(A)
    norm_B = np.linalg.norm(B)

    if norm_A == 0 or norm_B == 0:
        return 0.0

    return float(np.dot(A, B) / (norm_A * norm_B))


def hybrid_search_helper(
    session: SessionDep,
    embedder: EmbedderDep,
    bm_scorer: BestMatch,
    model_class: Type[T],
    user: User | None,
    query: str | None,
    limit: int,
):
    if user or query:
        user_embedding = user.embedding if user else None
        query_embedding = embedder.encode(query) if query else None

        if user_embedding is not None and query_embedding is not None:
            embedding = USER_WEIGHT * user_embedding + (1 - USER_WEIGHT) * query_embedding
            embedding = embedding / np.linalg.norm(embedding)
        elif user_embedding is not None:
            embedding = user_embedding
        else:
            embedding = query_embedding

        stmt = (
            select(model_class)
            .order_by(model_class.embedding.cosine_distance(embedding))
            .limit(SEARCH_NUMBER if query else limit)
        )
        candidates = session.exec(stmt).all()

        if query:
            cos_sims = [cosine_similarity(entity.embedding, embedding) for entity in candidates]  # type: ignore
            bm_score = [bm_scorer.compute_bm25_score(query, entity) for entity in candidates]

            candidates = hybrid_rank(candidates, np.array(cos_sims), np.array(bm_score), alpha, limit)
    else:
        # Return random items
        stmt = (
            select(model_class)
            .order_by(func.random())
            .limit(limit)
        )
        candidates = session.exec(stmt).all()

    return candidates




@router.get("/", response_model=ProjectsPublic)
def search(session: SessionDep, embedder: EmbedderDep, project_bm: ProjectBMDep, query: str, limit: int = 5):
    embedded_query = embedder.encode(query)

    stmt = (
        select(Project)
        .order_by(Project.embedding.cosine_distance(embedded_query))
        .limit(SEARCH_NUMBER)
    )
    candidates = session.exec(stmt).all()

    cos_sims = [cosine_similarity(project.embedding, embedded_query) for project in candidates]
    bm_score = [project_bm.compute_bm25_score(query, project) for project in candidates]

    top_projects = hybrid_rank(candidates, np.array(cos_sims), np.array(bm_score), alpha, limit)

    projects_public = [
        ProjectPublic.model_validate(project, from_attributes=True)
        for project in top_projects
    ]

    return ProjectsPublic(projects=projects_public)


@router.get("/best-for-me", response_model=ProjectsPublic)
def search_best_projects(session: SessionDep, user: CurrentUser, limit: int = 5):

    embedded_query = user.embedding

    stmt = (
        select(Project)
        .order_by(Project.embedding.cosine_distance(embedded_query))
        .limit(limit)
    )

    candidates = session.exec(stmt).all()

    projects_public = [
        ProjectPublic.model_validate(project, from_attributes=True)
        for project in candidates
    ]

    return ProjectsPublic(projects=projects_public)


@router.get("/project/{project_id}/people", response_model=list[UserPublic])
def search_people_for_project(
    session: SessionDep,
    project_id: UUID = Path(..., description="Project ID to find people for"),
    limit: int = Query(10, description="Maximum number of people to return")
):
    """
    Find people who might be good matches for a specific project.
    Returns users ranked by embedding similarity to the project.
    """
    project = get_project(session, project_id)
    project_embedding = project.embedding

    stmt = (
        select(User)
        .order_by(User.embedding.cosine_distance(project_embedding))
        .limit(limit)
    )
    candidates = session.exec(stmt).all()

    users_public = [
        UserPublic.model_validate(user, from_attributes=True)
        for user in candidates
    ]

    return users_public


@router.get("/projects", response_model=ProjectsPublic)
def get_projects(
    session: SessionDep,
    embedder: EmbedderDep,
    project_bm: ProjectBMDep,
    user: OptionalCurrentUser,
    query: str | None = None,
    limit: int = 5
):
    """
    Get projects based on context:
    - If user is logged in and/or query is provided: use embedding-based search
    - Otherwise: return random projects
    """
    candidates = hybrid_search_helper(session, embedder, project_bm, Project, user, query, limit)
    projects_public = [
        ProjectPublic.model_validate(project, from_attributes=True)
        for project in candidates
    ]

    return ProjectsPublic(projects=projects_public)


@router.get("/people", response_model=UsersPublic)
def get_people(
    session: SessionDep,
    embedder: EmbedderDep,
    user_bm: UserBMDep,
    user: OptionalCurrentUser,
    query: str | None = None,
    limit: int = 5
):
    """
    Get people based on context:
    - If user is logged in and/or query is provided: use embedding-based search
    - Otherwise: return random people
    """

    candidates = hybrid_search_helper(session, embedder, user_bm, User, user, query, limit)

    users_public = [
        UserPublic.model_validate(user_item, from_attributes=True)
        for user_item in candidates
    ]

    return UsersPublic(users=users_public)