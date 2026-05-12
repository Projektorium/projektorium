from fastapi import APIRouter

from app.api.routes import (
    login, project_likes, user_likes, signup, logout,
    projects, profiles, search, utils, positions,
    messages, participants, project_application, applicants
)

from app.core.config import settings


api_router = APIRouter()
api_router.include_router(login.router)
api_router.include_router(signup.router)
api_router.include_router(logout.router)

api_router.include_router(projects.router)
api_router.include_router(profiles.router)
api_router.include_router(positions.router)
api_router.include_router(search.router)
api_router.include_router(utils.router)

api_router.include_router(messages.router)
api_router.include_router(project_likes.router)
api_router.include_router(user_likes.router)
api_router.include_router(participants.router)
api_router.include_router(project_application.router)
api_router.include_router(applicants.router)







# if settings.ENVIRONMENT == "local":
#     api_router.include_router(private.router)
