from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app import schemas
from app.models.chat import ChatMessage
from app.services import chatbot_service


router = APIRouter(prefix="/chatbot", tags=["Chatbot"])


@router.post("/chat")
def chat_with_assistant(request: schemas.ChatRequest, db: Session = Depends(get_db)):

    context = chatbot_service.get_relevant_context(
        db, 
        request.message, 
        request.category_id
    )
    

    past_messages = db.query(ChatMessage).filter(
        ChatMessage.session_id == request.session_id
    ).order_by(ChatMessage.timestamp.desc()).limit(5).all()
    

    formatted_history = []
    for msg in reversed(past_messages):
        # The new SDK uses 'user' and 'model'
        role = "user" if msg.role == "user" else "model"
        
        # NEW STRUCTURE: 'parts' is a list of dicts with 'text'
        formatted_history.append({
            "role": role, 
            "parts": [{"text": msg.content}] # Note the 'text' key here!
        })

    ai_text = chatbot_service.generate_ai_response(
        request.message, 
        context, 
        formatted_history
    )


    db.add(ChatMessage(
        session_id=request.session_id, 
        role="user", 
        content=request.message
    ))
    db.add(ChatMessage(
        session_id=request.session_id, 
        role="assistant", 
        content=ai_text
    ))
    db.commit()


    return {"response": ai_text}