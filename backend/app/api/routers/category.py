from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services import auth, crud
from app.models.product import Category
from app.schemas import category as category_schemas
from app import schemas


router = APIRouter(prefix="/categories", tags=["categories"])


@router.post("/", response_model=category_schemas.Category, 
             status_code=status.HTTP_201_CREATED)
def create_category(
    category: category_schemas.CategoryCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(auth.get_current_user)):
    return crud.create_category(db=db, category=category)


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(auth.get_current_user)):
    success = crud.delete_category(db, category_id)
    if not success:
        raise HTTPException(status_code=404, detail="Category not found")
    return None


@router.get("/", response_model=list[schemas.Category])
def read_categories(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    categories = crud.get_categories(db, skip=skip, limit=limit)
    return categories
    