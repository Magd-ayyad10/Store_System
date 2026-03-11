from pydantic import BaseModel
from typing import List


class CartItemCreate(BaseModel):
    user_id: int
    product_id: int
    quantity: int = 1


class CartItemEntry(BaseModel):
    product_id: int
    product_name: str
    quantity: int
    unit_price: float
    subtotal: float


class CartSummary(BaseModel):
    user_id: int
    items: List[CartItemEntry]
    total_price: float