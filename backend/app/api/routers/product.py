from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form, status
from app.models.user import User
from app.schemas import product as product_shcemas
from app import schemas
from app.core.database import get_db
from sqlalchemy.orm import Session
from app.services import crud, auth, storage
from app.services.auth import get_current_user, verify_password, create_access_token
from typing import List
from app.services.storage import upload_product_image


router = APIRouter(
    prefix="/products",
    tags=["products"]
)


@router.post("/", status_code=201)
def create_product(
    name: str = Form(...),
    price: float = Form(...),
    stock: int = Form(...),
    category_id: int = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user) 
):

    file_content = image.file.read()
    image_url = storage.upload_product_image(file_content, image.filename)
    
    product_dict = {
        "name": name,
        "price": price,
        "stock": stock,
        "category_id": category_id,
        "cover_image_url": image_url
    }
    
    return crud.create_product(db=db, product_data=product_dict)

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


@router.post("/likes/{user_id}/{product_id}")
def like_a_product(user_id: int, product_id: int, db: Session = Depends(get_db)):
    result = crud.add_like(db, user_id=user_id, product_id=product_id)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return {"message": f"Successfully liked product {product_id}..."}


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user)
):
    success = crud.delete_product(db, product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return None