import os
import uuid
from supabase import create_client, Client
from app.core.config import settings
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


def upload_product_image(file_bytes: bytes, file_name: str):
    extension = file_name.split(".")[-1]
    unique_name = f"{uuid.uuid4()}.{extension}"
    file_path = f"covers/{unique_name}"
    
    supabase.storage.from_("product_images").upload(file_path, file_bytes)
    return supabase.storage.from_("product_images").get_public_url(file_path) 