import json
import logging
from pathlib import Path
import random
import struct
from app.api.routes.positions import add_position
from app.schemas.position import PositionCreate
from app.schemas.project import ProjectCreate, ProjectUpdate
from app.schemas.tag import TagCreate
from app.schemas.user import UserUpdateMe
from sqlmodel import Session
from app.core.config import settings
from app.core.security import get_password_hash
from app.models.common import get_zero_vector
from app.core.embeddings import get_embedder
from app.core.spell.spellCheker import get_spell_checker

from app.api.routes.profiles import update_profile
from app.api.routes.projects import create_project, update_project

from app.models.models import *  # type: ignore


spellChecker = get_spell_checker()
embedder = get_embedder()


def get_mock_data_path() -> Path:
    return settings.mock_data_path


def load_mock_data() -> dict:
    """Load mock data from the JSON file."""
    mock_data_path = get_mock_data_path()

    if not mock_data_path.exists():
        raise FileNotFoundError(
            f"Mock data file not found at {mock_data_path}")

    with open(mock_data_path, "r", encoding="utf-8") as f:
        return json.load(f)


def int_to_uuid(id: int) -> uuid.UUID:
    """
    Convert an integer to a deterministic UUID. ONLY FOR DEVELOPMENT
    """
    # Pack the integer into 8 bytes (little endian)
    packed = struct.pack('<Q', id)

    # Create a 16-byte array with zeros in the first 8 bytes
    # and the integer in the last 8 bytes
    uuid_bytes = packed + b'\x00' * 8

    # Create a UUID from these bytes
    return uuid.UUID(bytes=uuid_bytes)


def uuid_to_int(uuid_obj: uuid.UUID) -> int:
    # Extract the first 8 bytes and convert back to integer
    return struct.unpack('<Q', uuid_obj.bytes[:8])[0]


def add_users_batch(session: Session, users: list[dict]) -> dict[int, User]:
    """Add all users in a single batch operation."""
    user_objects = []
    user_map: dict[int, User] = {}

    hashed_passoword = get_password_hash("password")
    # Create user objects
    for user_data in users:
        user = User(
            id=int_to_uuid(int(user_data["id"])),
            name=user_data["first_name"],
            last_name=user_data["last_name"],
            email=user_data["email"],
            description=user_data.get("description", ""),
            hashed_password=hashed_passoword,
            is_superuser=user_data.get("is_superuser", False),
            profile_image=user_data.get("profile_image", None),
            mean_tag_embedding=get_zero_vector(),
            description_embedding=get_zero_vector(),
            embedding=get_zero_vector(),
        )

        user_objects.append(user)
        user_map[int(user_data['id'])] = user

    session.add_all(user_objects)
    session.commit()

    print("Users have been successfully added. Trying to set up the embeddings")

    # Update users profiles
    for user_data in users:
        user_id = int(user_data['id'])

        curr_user = user_map[user_id]
        tags = [TagCreate(name=skill) for skill in user_data.get("skills", [])]

        desc = user_data.get("description", "")
        if isinstance(desc, list):
            desc = ''.join(desc)

        profile_in = UserUpdateMe(
            tags=tags,
            description=desc,
        )

        update_profile(curr_user.id, profile_in, session,
                       spellChecker, embedder, curr_user)

    return user_map


def add_project(session: Session, project_data: dict, owner_id: uuid.UUID) -> Project:
    """Add all projects in a single batch operation."""
    project = Project(
        id=int_to_uuid(int(project_data["id"])),
        owner_id=owner_id,
        title=project_data["title"],
        description=project_data["description"],
        mean_tags_embedding=get_zero_vector(),
        text_embedding=get_zero_vector(),
        embedding=get_zero_vector(),
    )


    session.add(project)
    session.commit()

    return project


def create_project_data_map(projects: list[dict]) -> dict[int, dict]:
    """Returns dict[project_id, project_data]."""
    project_map: dict[int, dict] = {}

    for project_data in projects:
        project_map[int(project_data["id"])] = project_data

    return project_map


def add_user_project_links_batch(session: Session, projects: list[dict], links: list[dict], user_map: dict[int, User]) -> tuple[dict[int, Project], dict[int, User]]:
    """
    Creates projects and asigns users to the projects.
    Add all user-project links in a single batch operation.
       Returns user with ADMIN rigths and dict of all projects
    """
    # Create dict with id : project
    project_data_map = create_project_data_map(projects)

    project_map: dict[int, Project] = {}

    # Track added links to avoid duplicates
    added_links = set()
    link_objects = []

    admins: dict[int, User] = {}

    def add_link(user_id: int, project_id: int,
                 permission=ProjectRights.READ, position_title="Position",
                 position_description="Position Description"
    ):
        if (user_id, project_id) in added_links:
            return False

        user_uuid = int_to_uuid(user_id)
        project_uuid = int_to_uuid(project_id)

        link = UserProjectLink(user_id=user_uuid, project_id=project_uuid, permission=permission,
                               position_title=position_title, position_description=position_description)
        link_objects.append(link)

        # Track that we've added this link
        added_links.add((user_id, project_id))

        return True
    
    def add_admin_link(user_id: int, project_id: int,):
        project_map[project_id] = add_project(session, project_data_map[project_id], int_to_uuid(user_id))
        admins[project_id] = user_map[user_id]
        add_link(user_id, project_id, ProjectRights.ADMIN, "OWNER", "OWNER DESCRIPTION")

    for link_data in links:
        user_id, project_id = int(link_data["user_id"]), int(link_data["project_id"])
        if project_id in admins:
            add_link(user_id, project_id)
        else:
            add_admin_link(user_id, project_id)

    for project_id in project_data_map.keys():
        if project_id in admins:
            continue
        admin_id = None
        if project_id in user_map:
            admin_id = project_id
        elif len(links) > 0:
            admin_id = int(links[random.randint(0, len(links) - 1)]["user_id"])
        else:
            raise ValueError("Cannot assign any admin to project ", project_id)

        add_admin_link(admin_id, project_id)


    session.add_all(link_objects)
    session.flush()


    return project_map, admins


def modify_projects(session: Session, projects: list[dict], admins: dict[int, User]):
    for project_data in projects:
        project_id = int(project_data["id"])

        admin_user = admins[project_id]
        tags = [TagCreate(name=area) for area in project_data.get("areas", [])]

        desc = project_data.get("description", "")
        if isinstance(desc, list):
            desc = ''.join(desc)
        project_in = ProjectUpdate(title=project_data["title"], tags=tags,
                                   description=desc,)
        update_project(int_to_uuid(project_id), project_in,
                       session, spellChecker, embedder, admin_user)


def add_positions_to_projects(session: Session, projects: list[dict], admins: dict[int, User]):
    for project_data in projects:
        project_id = int(project_data["id"])

        admin_user = admins[project_id]
        for open_pos in project_data.get("open_positions", []):
            # tags = [TagCreate(name=tag) for tag in open_pos.get("tags", [])]
            pos = PositionCreate(
                title=open_pos["title"], description=open_pos["description"])
            add_position(pos, session, admin_user, int_to_uuid(project_id))


def seed_db(session: Session):
    """Seed the database with mock data."""
    data = load_mock_data()

    print("Starting database seeding...")
    try:
        print("\n\n\nAdding users...\n\n\n")
        user_map = add_users_batch(session, data.get("users", []))


        print("\n\n\nAdding user-project links...\n\n\n")
        links = data.get("user_project_links", [])
        project_map, admins = add_user_project_links_batch(session, data.get("projects", []), links, user_map)

        print("\n\n\nModifying projects (adding embeddings)\n\n\n")
        modify_projects(session, data.get("projects", []), admins)

        print("\n\n\nAdd open positions \n\n\n")
        add_positions_to_projects(session, data.get("projects", []), admins)

        session.commit()
        print("Database seeding completed successfully!")

    except Exception as e:
        # Roll back on error
        session.rollback()
        print(f"Error during database seeding: {e}")
        raise
