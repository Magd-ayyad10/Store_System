import os
import uuid
from supabase import create_client, Client
from core.config import settings
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


def upload_image_to_supabase(file_bytes: bytes, file_name: str):
    bucket_name = "product_images"

    extension = file_name.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{extension}"

    file_path = f"covers/{file_name}"
    
    supabase.storage.from_(bucket_name).upload(
        path=file_path,
        file=file_bytes,
        file_options={"content-type": "image/jpeg"} 
    )
    
    return supabase.storage.from_(bucket_name).get_public_url(file_path)    