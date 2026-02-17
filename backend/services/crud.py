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


def create_product(db: Session, product: ProductCreate):
    db_product = Product(
        name=product.name,
        description=product.description,
        price=product.price,
        stock=product.stock,
        category_id=product.category_id  # <--- Map it here
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def add_like(db: Session, user_id: int, product_id: int):
    """link a user to a product (The 'Like')."""
    user = db.query(User).filter(User.id == user_id).first()
    product = db.query(Product).filter(Product.id == product_id).first()

    if not user or not product:
        return None


    if product not in user.liked_products:
        user.liked_products.append(product)
        db.commit()
    
    return product


def create_user(db: Session, user: user_schemas.UserCreate):
    hashed_pwd = hash_password(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_pwd # Save the HASH, not the plain text!
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_category(db: Session, category: category_schemas.CategoryCreate):
    db_category = Category(name=category.name)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


def get_category(db: Session, category_id: int):
    return db.query(Category).filter(Category.id == category_id).first()
