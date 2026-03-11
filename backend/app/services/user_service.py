from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas import user as user_schemas
from app.core.security import hash_password


def register_user(db: Session, user: user_schemas.UserCreate):
    hashed_pwd = hash_password(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_pwd
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()
