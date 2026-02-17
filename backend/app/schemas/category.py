from pydantic import BaseModel
from typing import List, Optional


class CategoryBase(BaseModel):
    name: str


class CategoryCreate(CategoryBase):
    pass 


class Category(CategoryBase):
    id: int 
    class config:
        from_attributes = True

        