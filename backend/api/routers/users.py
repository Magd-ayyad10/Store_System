from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from services import crud
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from services.auth import verify_password, create_access_token
from app.models.user import User  
from app.schemas import user as user_schemas  


router = APIRouter(
    prefix="/users",
    tags=["Users & Likes"]
)


@router.post("/", response_model=user_schemas.User)
def create_user(user: user_schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return crud.create_user(db=db, user=user)




@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/{user_id}/like/{product_id}")
def like_a_product(user_id: int, product_id: int, db: Session = Depends(get_db)):
    result = crud.add_like(db, user_id=user_id, product_id=product_id)
    if result is None:
        raise HTTPException(status_code=404, detail="User or Product not found")
    return {"message": f"Successfully liked product {product_id}"}


