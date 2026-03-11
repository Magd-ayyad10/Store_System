from fastapi import FastAPI
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware 
from app.api.routers import product, users, category, cart, chatbot
from app.core.database import engine, Base
import logging

logging.basicConfig(level=logging.DEBUG)


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Magd's Store System", 
    description="API for managing products, users, and categories in the store system...", 
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, list your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")

app.include_router(cart.router)
app.include_router(product.router)
app.include_router(users.router)
app.include_router(category.router)
app.include_router(chatbot.router)  

@app.get("/")
def root():
    return {"message": "Welcome to the Store API!"}

    