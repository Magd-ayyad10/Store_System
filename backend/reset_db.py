
from core.database import engine, Base
# Import models to ensure they are registered with Base
from app.models.product import Product
from app.models.user import User

def reset_db():
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    print("Done.")

if __name__ == "__main__":
    reset_db()
