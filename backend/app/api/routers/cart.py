from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import verify_api_key
from app.services import cart_service
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas import cart as schemas


router = APIRouter(prefix="/cart", tags=["Cart"])


@router.post("/")
def add_item_to_cart(
    item: schemas.CartItemCreate,
    db: Session = Depends(get_db),
    _: str = Depends(verify_api_key)
):
    return cart_service.add_to_cart(db, item)


@router.delete("/{user_id}/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_item_from_cart(
    user_id: int,
    product_id: int,
    db: Session = Depends(get_db),
    _: str = Depends(verify_api_key)
):
    success = cart_service.remove_from_cart(db, user_id, product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Item not found in cart")
    return None


@router.get("/{user_id}", response_model=schemas.CartSummary)
def read_cart(
    user_id: int,
    db: Session = Depends(get_db),
    _: str = Depends(verify_api_key)
):
    return cart_service.get_user_cart(db, user_id=user_id)


@router.get("/{user_id}/count")
def cart_count(
    user_id: int,
    db: Session = Depends(get_db),
    _: str = Depends(verify_api_key)
):
    count = cart_service.get_cart_count(db, user_id)
    return {"count": count}