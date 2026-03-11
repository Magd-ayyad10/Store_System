from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from app.core.database import Base
from datetime import datetime


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True) 
    role = Column(String) 
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)

    