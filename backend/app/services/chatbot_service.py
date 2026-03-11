import google.genai as genai
from sqlalchemy.orm import Session
from app.models.product import Product
from app.core.config import settings


client = genai.Client(api_key=settings.GEMINI_API_KEY)


def get_relevant_context(db: Session, message: str, category_id: int = None):
    """Searches Supabase for products matching keywords in the user's message."""
    keywords = message.split()
    if not keywords:
        return "No products found."
        
    query = db.query(Product)
    
    if category_id:
        query = query.filter(Product.category_id == category_id)
    

    search_filter = Product.name.ilike(f"%{keywords[0]}%") | \
                    Product.description.ilike(f"%{keywords[0]}%")
    
    results = query.filter(search_filter).limit(3).all()
    
    if not results:
        return "No specific matching products found in the catalog right now."

    context = ""
    for p in results:
        context += f"- {p.name}: ${p.price}. {p.description[:100]}...\n"
    return context


def generate_ai_response(user_message: str, product_context: str, history: list):
    """Sends the prompt to Gemini using the new Client SDK."""
    
    system_instr = (
        "You are an enthusiastic, high-energy store seller! 🤩 "
        "Use the following product data to help the customer: "
        f"\n\nSTORE DATA:\n{product_context}"
    )

    response = client.models.generate_content(
        model="gemini-2.5-flash", 
        contents=history + [user_message],
        config={
            "system_instruction": system_instr
        }
    )
    
    return response.text
    