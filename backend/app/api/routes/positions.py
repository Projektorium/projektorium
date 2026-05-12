from uuid import UUID

from fastapi import APIRouter, HTTPException, status
from sqlmodel import select
from app.api.deps import CurrentUser, SessionDep, ensure_project_admin, get_project
from app.models.position import OpenPosition
from app.schemas.position import PositionCreate, PositionResponse, PositionSchema, PositionUpdate
from app.api.common_responses import COMMON_ERROR_RESPONSES


router = APIRouter(prefix="/projects/{project_id}/positions", tags=[
                   "positions"], responses=COMMON_ERROR_RESPONSES)  # type: ignore


@router.get(
    "/",
    response_model=PositionResponse,
    summary="List positions in a project"
)
def list_positions(
    project_id: UUID,
    session: SessionDep,
) -> PositionResponse:

    # Check if the project exists
    get_project(session, project_id)

    stmt = select(OpenPosition).where(OpenPosition.project_id == project_id)
    positions = session.exec(stmt).all()

    position_response = [
        PositionSchema.model_validate(pos)
        for pos in positions
    ]

    return PositionResponse(positions=position_response)


@router.post("/", response_model=PositionSchema)
def add_position(
    pos_in: PositionCreate,
    session: SessionDep,
    current_user: CurrentUser,
    project_id: UUID
) -> OpenPosition:
    project = get_project(session, project_id)
    ensure_project_admin(session, project, current_user)

    position = OpenPosition(
        title=pos_in.title,
        description=pos_in.description or "",
        project_id=project.id,
    )

    session.add(position)
    session.commit()
    session.refresh(position)
    return position


@router.patch("/{position_id}", response_model=PositionSchema)
def update_position(
    pos_in: PositionUpdate,
    session: SessionDep,
    current_user: CurrentUser,
    project_id: UUID,
    position_id: UUID,
) -> OpenPosition:
    project = get_project(session, project_id)
    ensure_project_admin(session, project, current_user)

    position = session.get(OpenPosition, position_id)
    if not position or position.project_id != project.id:
        raise HTTPException(
            status_code=404, detail="Position not found in this project")

    update_data = pos_in.model_dump(exclude_unset=True)
    for attr, value in update_data.items():
        setattr(position, attr, value)

    session.add(position)
    session.commit()
    session.refresh(position)
    return position


@router.delete("/{position_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_position(
    session: SessionDep,
    current_user: CurrentUser,
    project_id: UUID,
    position_id: UUID,
):
    project = get_project(session, project_id)
    ensure_project_admin(session, project, current_user)

    position = session.get(OpenPosition, position_id)
    if not position or position.project_id != project.id:
        raise HTTPException(
            status_code=404, detail="Position not found in this project")

    session.delete(position)
    session.commit()
