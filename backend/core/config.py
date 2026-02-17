import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()

class Settings(BaseSettings):
    # Project Info
    PROJECT_NAME: str = "Magd's Store System"
    
    # Database Settings
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    
    # Security Settings
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

settings = Settings()