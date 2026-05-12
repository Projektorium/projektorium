from uuid import UUID
from app.schemas.user import UserLike, UserPublic
from fastapi import APIRouter, Body, Query, status
from app.api.deps import CurrentUser, OptionalCurrentUser, SessionDep
from app.models.user import User
from app.models.link import UserLikedUserLink

from fastapi import HTTPException
from sqlmodel import col, select

router = APIRouter(prefix="/users/likes", tags=["likes"])



@router.get("/", response_model=list[UserPublic])
def get_liked_users(
    session: SessionDep,
    user: CurrentUser,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, gt=0, le=100)
):
    users = session.exec(
        select(User)
        .join(UserLikedUserLink, col(UserLikedUserLink.liked_user_id) == User.id)
        .where(UserLikedUserLink.user_id == user.id)
        .offset(skip)
        .limit(limit)
    ).all()

    # Fetches all the liked users from the db
    # users = user.liked_users[skip : skip + limit]
    return users


@router.post("/status", response_model=list[UserLike])
def get_users_like_info(
    session: SessionDep, 
    user: OptionalCurrentUser, 
    user_ids: list[UUID] = Body(...)
):

    if not user or not user_ids:
        return [UserLike(user_id=id, is_liked=False) for id in user_ids]

    # Get set of IDs for projects liked by this user
    liked_users_ids: set[UUID] = set()

    if user_ids:
        liked_links = session.exec(
            select(UserLikedUserLink.liked_user_id)
            .where(
                UserLikedUserLink.user_id == user.id,
                col(UserLikedUserLink.liked_user_id).in_(user_ids)
            )
        ).all()


        liked_users_ids = set(liked_links)


    # Add is_liked flag to each project
    return [UserLike(user_id=id, is_liked=(id in liked_users_ids)) for id in user_ids]

@router.post("/{user_id}", status_code=status.HTTP_200_OK)
def like_user(
    user_id: UUID,
    session: SessionDep,
    user: CurrentUser,
):
    # Ensure user exists
    target = session.get(User, user_id)
    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    # Prevent liking self
    if user.id == user_id:
        raise HTTPException(status_code=400, detail="Cannot like yourself")

    existing = session.exec(
        select(UserLikedUserLink)
        .where(
            UserLikedUserLink.user_id == user.id,
            UserLikedUserLink.liked_user_id == user_id
        )
    ).first()

    if existing:
        return {"detail": "User was already liked"}

    user.liked_users.append(target)
    session.commit()
    return {"detail": "User liked"}


@router.delete("/{user_id}", status_code=status.HTTP_200_OK)
def unlike_user(
    user_id: UUID,
    session: SessionDep,
    user: CurrentUser,
):
    target = session.get(User, user_id)

    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    existing = session.exec(
        select(UserLikedUserLink)
        .where(
            UserLikedUserLink.user_id == user.id,
            UserLikedUserLink.liked_user_id == user_id
        )
    ).first()

    if not existing:
        return {"detail": "User was not liked to begin with"}

    session.delete(existing)
    session.commit()
    return {"detail": "User was successfully unliked"}
