from fastapi import FastAPI
from fastapi.security import OAuth2PasswordBearer 
from api.routers import product, users, category
from core.database import engine, Base
import logging

logging.basicConfig(level=logging.DEBUG)


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Magd's Store System", 
    description="API for managing products, users, and categories in the store system...", 
    version="1.0.0"
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")

app.include_router(product.router)
app.include_router(users.router)
app.include_router(category.router)

@app.get("/")
def root():
    return {"message": "Welcome to the Store API!"}