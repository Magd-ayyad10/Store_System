from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from supabase_auth import User
from app.schemas import product as product_shcemas
from app import models
from core.database import get_db
from sqlalchemy.orm import Session
from services import crud, auth, storage
from services.auth import get_current_user, verify_password, create_access_token
from typing import List
from services.storage import upload_image_to_supabase


router = APIRouter(
    prefix="/products",
    tags=["products"]
)


@router.post("/", status_code=201)
def create_product(
    name: str = Form(...),
    description: str = Form(None),
    price: float = Form(...),
    stock: int = Form(...),
    category_id: int = Form(...),
    image: UploadFile = File(...), # <--- This adds the upload button
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    file_content = image.file.read()
    image_url = upload_image_to_supabase(file_content, image.filename)
    
    
    new_product = models.Product(
        name=name,
        description=description,
        price=price,
        stock=stock,
        category_id=category_id,
        cover_image_url=image_url # <--- Store the URL
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

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
    
    """Fetch a single product by its ID..."""
    db_product = crud.get_product(db, product_id=product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product