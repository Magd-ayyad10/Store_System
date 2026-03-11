from sqlalchemy.orm import Session
from app.models.product import Product
from app.models.user import User
from app.models.product import Category
from app.schemas import category as category_schemas
from app.schemas.product import ProductCreate
from app.schemas.user import UserCreate
from app.schemas import user as user_schemas
from .auth import hash_password



def get_product(db: Session, product_id: int):
    """Fetch a single product by its ID."""
    return db.query(Product).filter(Product.id == product_id).first()


def get_products(db: Session, skip: int = 0, limit: int = 100):
    """Fetch a list of products with pagination."""
    return db.query(Product).offset(skip).limit(limit).all()


def create_product(db: Session, product_data: dict):
    db_product = Product(**product_data)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def add_like(db: Session, user_id: int, product_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    product = db.query(Product).filter(Product.id == product_id).first()

    if not user:
        return {"error": "user_not_found"}
    if not product:
        return {"error": "product_not_found"}

    if product not in user.liked_products:
        user.liked_products.append(product)
        db.commit()

    return product


def create_user(db: Session, user: user_schemas.UserCreate):
    hashed_pwd = hash_password(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_pwd
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        db.delete(user)
        db.commit()
        return True
    return False



def create_category(db: Session, category: category_schemas.CategoryCreate):
    db_category = Category(name=category.name)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


def get_categories(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Category).offset(skip).limit(limit).all()


def delete_product(db: Session, product_id: int):
    product = db.query(Product).filter(Product.id == product_id).first()
    if product:
        db.delete(product)
        db.commit()
        return True
    return False


def delete_category(db: Session, category_id: int):
    category = db.query(Category).filter(Category.id == category_id).first()
    if category:
        db.delete(category)
        db.commit()
        return True
    return False
