from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services import crud, auth, user_service, auth_service
from app.services.auth import verify_password, create_access_token, get_current_user
from app.models.user import User  
from app.schemas import user as user_schemas  
from app.schemas.token import Token


router = APIRouter(
    prefix="/Register",
    tags=["Authentication"]
)


@router.post("/", response_model=user_schemas.User)
def create_user(
    user: user_schemas.UserCreate,
    db: Session = Depends(get_db)
    ):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return user_service.register_user(db=db, user=user)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int, 
    db: Session = Depends(get_db),
    
    current_user: User = Depends(auth.get_current_user)
):
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this user"
        )
    
    success = crud.delete_user(db, user_id)
    if not success:
        raise HTTPException(status_code=401, detail="User not found")
    
    return None

@router.post("/login" , response_model= Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)):
    user = auth_service.authenticate_user(db, form_data.username, form_data.password)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
            )
    access_token = create_access_token(data={"sub": user.username, "user_id": user.id})
    return {"access_token": access_token, "token_type": "bearer"}

  
@router.post("/", response_model=user_schemas.User, status_code=status.HTTP_201_CREATED)
def signup(
    user_data: user_schemas.UserCreate,
    db: Session = Depends(get_db)
):
    existing_user = user_service.get_user_by_email(db, email=user_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return user_service.register_new_user(db=db, user_data=user_data)