from fastapi import APIRouter, Depends, HTTPException
from app.schemas import product as product_shcemas
from app import models
from core.database import get_db
from sqlalchemy.orm import Session
from services import crud, auth
from services.auth import get_current_user, verify_password, create_access_token
from typing import List


router = APIRouter(
    prefix="/products",
    tags=["products"]
)


@router.post("/", response_model=product_shcemas.Product)
def create_product(
    product: product_shcemas.ProductCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
   ):
    """Create a new product."""
    return crud.create_product(db, product)


@router.get("/", response_model=List[product_shcemas.Product])
def read_products(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)):
    
    """Fetch a list of products with pagination."""
    return crud.get_products(db, skip=skip, limit=limit)


@router.get("/{product_id}", response_model=product_shcemas.Product)
def read_product(
    product_id: int,
    db: Session = Depends(get_db)):
    
    """Fetch a single product by its ID."""
    db_product = crud.get_product(db, product_id=product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product