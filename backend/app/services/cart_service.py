from sqlalchemy.orm import Session
from app.models.cart import CartItem
from app.models.product import Product
from app.schemas.cart import CartItemCreate


def add_to_cart(db: Session, item_data: CartItemCreate):
    existing_item = db.query(CartItem).filter(
        CartItem.user_id == item_data.user_id,
        CartItem.product_id == item_data.product_id
    ).first()

    if existing_item:
        existing_item.quantity += item_data.quantity
        db.commit()
        db.refresh(existing_item)
        return existing_item

    new_item = CartItem(
        user_id=item_data.user_id,
        product_id=item_data.product_id,
        quantity=item_data.quantity
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item


def remove_from_cart(db: Session, user_id: int, product_id: int):
    item = db.query(CartItem).filter(
        CartItem.user_id == user_id,
        CartItem.product_id == product_id
    ).first()
    if item:
        db.delete(item)
        db.commit()
        return True
    return False


def get_user_cart(db: Session, user_id: int):
    results = db.query(CartItem, Product).join(
        Product, CartItem.product_id == Product.id
    ).filter(CartItem.user_id == user_id).all()

    items = []
    total_price = 0.0

    for cart_item, product in results:
        subtotal = product.price * cart_item.quantity
        items.append({
            "product_id": product.id,
            "product_name": product.name,
            "quantity": cart_item.quantity,
            "unit_price": product.price,
            "subtotal": subtotal
        })
        total_price += subtotal

    return {
        "user_id": user_id,
        "items": items,
        "total_price": total_price
    }


def get_cart_count(db: Session, user_id: int):
    return db.query(CartItem).filter(CartItem.user_id == user_id).count()