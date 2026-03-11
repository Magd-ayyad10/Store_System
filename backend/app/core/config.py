import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings


load_dotenv()


class Settings(BaseSettings):

    PROJECT_NAME: str = "Magd's Store System"
    

    DATABASE_URL: str = os.getenv("DATABASE_URL")
    SUPABASE_URL: str = os.getenv("SUPABASE_URL")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY")
    SUPABASE_BUCKET_NAME: str = os.getenv("SUPABASE_BUCKET_NAME")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")
    
    class Config:
        env_file = ".env"

        extra = "ignore"


    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    STORE_API_KEY: str = os.getenv("STORE_API_KEY", "storex-api-key-2025")

settings = Settings()

