from fastapi import FastAPI
from api.routers import product, users, category
from core.database import engine, Base
import logging


logging.basicConfig(level=logging.DEBUG)


Base.metadata.create_all(bind=engine)


app = FastAPI(title="Magd's Store System")


app.include_router(product.router)
app.include_router(users.router)
app.include_router(category.router)



@app.get("/")
def root():
    return {"message": "Welcome to the Store API!"}