from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer 
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from core.database import get_db
from core.config import settings
from passlib.context import CryptContext
from app.models.user import User


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login") 

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials..",
        headers={"WWW-Authenticate": "Bearer"},
    )
    user = db.query(User).filter(User.username == User.username).first()
    if user is None:
        raise credentials_exception
    return user

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

