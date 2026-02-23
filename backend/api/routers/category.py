from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from services import crud
from app.schemas import category as category_schemas


router = APIRouter(prefix="/categories", tags=["categories"])


@router.post("/", response_model=category_schemas.Category)
def create_category(category: category_schemas.CategoryCreate, db: Session = Depends(get_db)):
    return crud.create_category(db=db, category=category)


@router.get("/")
def read_categories(db: Session = Depends(get_db)):
    return crud.get_categories(db)

    