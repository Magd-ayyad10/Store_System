from sqlalchemy import Column, Integer, String, Table, ForeignKey 
from sqlalchemy.orm import relationship
from core.database import Base


likes_table = Table(
    "likes",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("product_id", Integer, ForeignKey("products.id"), primary_key=True),
)


class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    price = Column(Integer)
    stock = Column(Integer)
    liked_by = relationship("User", secondary=likes_table, back_populates="liked_products")
    category_id = Column(Integer, ForeignKey("categories.id"))
    category = relationship("Category", back_populates="products")
    cover_image_url = Column(String, nullable=True)

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

    products = relationship("Product", back_populates="category")

