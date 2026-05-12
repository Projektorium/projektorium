import uuid
from typing import Optional

from sqlmodel import Session, select

from app.core.security import get_password_hash, verify_password
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdateSecurity
# from app.models_.faculty import Faculty
# from app.models_.link import UserFacultyLink


def create_user(*, session: Session, user_create: UserCreate) -> User:
    db_obj = User.model_validate(
        user_create,
        update={"hashed_password": get_password_hash(user_create.password)}
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def update_user(*, session: Session, db_user: User, user_in: UserUpdateSecurity) -> User:
    user_data = user_in.model_dump(exclude_unset=True)
    extra_data = {}
    if "password" in user_data:
        hashed = get_password_hash(user_data.pop("password"))
        extra_data["hashed_password"] = hashed
    db_user.sqlmodel_update(user_data, update=extra_data)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


def get_user_by_email(*, session: Session, email: str) -> Optional[User]:
    statement = select(User).where(User.email == email)
    return session.exec(statement).first()


def authenticate(*, session: Session, email: str, password: str) -> Optional[User]:
    db_user = get_user_by_email(session=session, email=email)
    if not db_user or not verify_password(password, db_user.hashed_password):
        return None
    return db_user



# def update_user_me(*, session: Session, db_user: User, data: UserUpdateMe) -> User:
#     payload = data.model_dump(exclude_unset=True)
#     db_user.sqlmodel_update(payload)
#     session.add(db_user)
#     session.commit()
#     session.refresh(db_user)
#     return db_user






# def create_item(*, session: Session, item_in: ItemCreate, owner_id: uuid.UUID) -> Item:
#     db_item = Item.model_validate(item_in, update={"owner_id": owner_id})
#     session.add(db_item)
#     session.commit()
#     session.refresh(db_item)
#     return db_item


# def get_faculty_by_name(*, session: Session, name: str) -> Optional[Faculty]:
#     statement = select(Faculty).where(Faculty.name == name)
#     return session.exec(statement).first()


# def create_faculty(*, session: Session, name: str) -> Faculty:
#     db_obj = Faculty(name=name)
#     session.add(db_obj)
#     session.commit()
#     session.refresh(db_obj)
#     return db_obj


# def get_user_faculties(*, session: Session, user_id: uuid.UUID) -> List[Faculty]:
#     statement = (
#         select(Faculty)
#         .join(UserFacultyLink)
#         .where(UserFacultyLink.user_id == user_id)
#     )
#     return session.exec(statement).all()


# def assign_user_to_faculty(*, session: Session, user_id: uuid.UUID, faculty_id: int) -> UserFacultyLink:
#     link = UserFacultyLink(user_id=user_id, faculty_id=faculty_id)
#     session.add(link)
#     session.commit()
#     session.refresh(link)
#     return link


# def remove_user_faculty(*, session: Session, user_id: uuid.UUID, faculty_id: int) -> Optional[UserFacultyLink]:
#     statement = select(UserFacultyLink).where(
#         (UserFacultyLink.user_id == user_id) &
#         (UserFacultyLink.faculty_id == faculty_id)
#     )
#     link = session.exec(statement).first()
#     if link:
#         session.delete(link)
#         session.commit()
#     return link