from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    message: str
    session_id: str
    user_id: Optional[int] = None
    product_id: Optional[int] = None
    category_id: Optional[int] = None

class ChatResponse(BaseModel):
    response: str