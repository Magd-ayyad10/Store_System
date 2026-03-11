from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from jose import jwt, JWTError
from app.core.config import settings
from app.services import user_service, auth
from app.schemas.token import Token


def authenticate_user(
    db: Session, username: str, password: str):
    user = user_service.get_user_by_username(db, username=username)
    if not user or not auth.verify_password(password, user.hashed_password):
        return None
    return user


def create_user_token(user_id: int):
    access_token = auth.create_access_token(data={"sub": str(user_id)})