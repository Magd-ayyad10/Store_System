from pydantic import BaseModel
from typing import Optional


class ProductBase(BaseModel):
    name: str
    description: str 
    price: int 
    stock: int 
    category_id: Optional[int] = None


class ProductCreate(ProductBase):
    pass


class Product(ProductBase):
    id: int 

    class Config:
        from_attribute = True

        