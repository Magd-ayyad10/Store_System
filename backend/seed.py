import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.core.database import SessionLocal, engine, Base
from app.models.product import Product, Category
from app.models.user import User
from app.models.cart import CartItem

Base.metadata.create_all(bind=engine)

db = SessionLocal()

CATEGORIES = [
    "Electronics",
    "Computers & Accessories",
    "Clothing & Fashion",
    "Home & Kitchen",
    "Books",
    "Sports & Outdoors",
    "Beauty & Personal Care",
    "Toys & Games",
]

PRODUCTS = [
    {
        "name": "Apple AirPods Pro 2nd Gen",
        "description": "Active Noise Cancellation, Adaptive Transparency, Personalized Spatial Audio with dynamic head tracking. Up to 6 hours of listening time with ANC enabled.",
        "price": 249,
        "stock": 150,
        "category": "Electronics",
        "image": "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop"
    },
    {
        "name": "Sony WH-1000XM5 Headphones",
        "description": "Industry-leading noise cancellation with Auto NC Optimizer. Crystal clear hands-free calling with 4 beamforming microphones. 30-hour battery life.",
        "price": 348,
        "stock": 85,
        "category": "Electronics",
        "image": "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop"
    },
    {
        "name": "Samsung Galaxy S24 Ultra",
        "description": "6.8-inch Dynamic AMOLED display, 200MP camera, Snapdragon 8 Gen 3 processor, built-in S Pen, 5000mAh battery with 45W fast charging.",
        "price": 1299,
        "stock": 45,
        "category": "Electronics",
        "image": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop"
    },
    {
        "name": "iPad Air M2 11-inch",
        "description": "M2 chip with 8-core CPU and 10-core GPU. 11-inch Liquid Retina display with True Tone. Support for Apple Pencil Pro and Magic Keyboard.",
        "price": 599,
        "stock": 120,
        "category": "Electronics",
        "image": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop"
    },
    {
        "name": "JBL Charge 5 Bluetooth Speaker",
        "description": "Powerful JBL Original Pro Sound with IP67 waterproof and dustproof rating. 20 hours of playtime. Built-in powerbank to charge your devices.",
        "price": 179,
        "stock": 200,
        "category": "Electronics",
        "image": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop"
    },
    {
        "name": "MacBook Pro 16-inch M3 Pro",
        "description": "M3 Pro chip with 12-core CPU, 18-core GPU. 16.2-inch Liquid Retina XDR display. 22 hours of battery life. 18GB unified memory, 512GB SSD.",
        "price": 2499,
        "stock": 30,
        "category": "Computers & Accessories",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop"
    },
    {
        "name": "Logitech MX Master 3S Mouse",
        "description": "Wireless performance mouse with ultra-fast scrolling. 8K DPI tracking on any surface. USB-C quick charging. Works on up to 3 devices.",
        "price": 99,
        "stock": 300,
        "category": "Computers & Accessories",
        "image": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop"
    },
    {
        "name": "Mechanical Keyboard RGB",
        "description": "Hot-swappable mechanical keyboard with Cherry MX switches. Full RGB backlight with per-key customization. Aircraft-grade aluminum frame.",
        "price": 149,
        "stock": 175,
        "category": "Computers & Accessories",
        "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop"
    },
    {
        "name": "Dell UltraSharp 27 4K Monitor",
        "description": "27-inch 4K UHD IPS display with 99% sRGB. USB-C hub with 90W power delivery. Height adjustable stand with tilt, swivel, and pivot.",
        "price": 619,
        "stock": 50,
        "category": "Computers & Accessories",
        "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop"
    },
    {
        "name": "Samsung 1TB SSD 990 Pro",
        "description": "PCIe 4.0 NVMe M.2 SSD with read speeds up to 7,450 MB/s. Advanced thermal control. Ideal for PS5, gaming PCs, and content creation.",
        "price": 109,
        "stock": 400,
        "category": "Computers & Accessories",
        "image": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=400&fit=crop"
    },
    {
        "name": "Classic Denim Jacket",
        "description": "Premium cotton denim jacket with button closure. Classic fit with chest pockets. Versatile layering piece for any season.",
        "price": 89,
        "stock": 250,
        "category": "Clothing & Fashion",
        "image": "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=400&fit=crop"
    },
    {
        "name": "Running Sneakers Ultra Boost",
        "description": "Lightweight running shoes with responsive cushioning. Breathable mesh upper with supportive heel counter. Continental rubber outsole.",
        "price": 180,
        "stock": 130,
        "category": "Clothing & Fashion",
        "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop"
    },
    {
        "name": "Aviator Sunglasses Polarized",
        "description": "Classic aviator style with polarized lenses. UV400 protection. Lightweight metal frame with adjustable nose pads for comfort.",
        "price": 59,
        "stock": 500,
        "category": "Clothing & Fashion",
        "image": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop"
    },
    {
        "name": "Leather Crossbody Bag",
        "description": "Genuine leather crossbody bag with adjustable strap. Multiple compartments with zip closure. Perfect for everyday use.",
        "price": 129,
        "stock": 80,
        "category": "Clothing & Fashion",
        "image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop"
    },
    {
        "name": "Premium Wool Scarf",
        "description": "100% merino wool scarf, ultra-soft and warm. Classic herringbone pattern. 180cm length, perfect for winter layering.",
        "price": 45,
        "stock": 300,
        "category": "Clothing & Fashion",
        "image": "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=400&fit=crop"
    },
    {
        "name": "Smart Robot Vacuum Cleaner",
        "description": "LiDAR navigation with precision mapping. 5000Pa suction power. Self-emptying dustbin. Works with Alexa and Google Home.",
        "price": 449,
        "stock": 60,
        "category": "Home & Kitchen",
        "image": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop"
    },
    {
        "name": "Premium Coffee Maker",
        "description": "12-cup programmable coffee maker with thermal carafe. Built-in grinder with 5 grind settings. Brew strength control and auto-start.",
        "price": 199,
        "stock": 90,
        "category": "Home & Kitchen",
        "image": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop"
    },
    {
        "name": "Cast Iron Dutch Oven 6Qt",
        "description": "Enameled cast iron dutch oven with self-basting lid. Even heat distribution. Oven safe up to 500F. Dishwasher safe. Made in France.",
        "price": 349,
        "stock": 40,
        "category": "Home & Kitchen",
        "image": "https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400&h=400&fit=crop"
    },
    {
        "name": "Aromatherapy Diffuser LED",
        "description": "Ultrasonic essential oil diffuser with color-changing LED lights. 400ml capacity, runs up to 12 hours. Whisper-quiet operation.",
        "price": 39,
        "stock": 350,
        "category": "Home & Kitchen",
        "image": "https://images.unsplash.com/photo-1602928298849-325cec8771c0?w=400&h=400&fit=crop"
    },
    {
        "name": "Set of 4 Indoor Plants",
        "description": "Curated collection of 4 easy-care indoor plants in ceramic pots. Includes Snake Plant, Pothos, ZZ Plant, and Peace Lily.",
        "price": 79,
        "stock": 70,
        "category": "Home & Kitchen",
        "image": "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=400&fit=crop"
    },
    {
        "name": "The Art of Programming",
        "description": "A comprehensive guide to software development, from algorithms to system design. 800 pages with practical exercises and real-world projects.",
        "price": 49,
        "stock": 500,
        "category": "Books",
        "image": "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=400&fit=crop"
    },
    {
        "name": "Atomic Habits by James Clear",
        "description": "An easy and proven way to build good habits and break bad ones. #1 New York Times bestseller with over 15 million copies sold.",
        "price": 16,
        "stock": 800,
        "category": "Books",
        "image": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop"
    },
    {
        "name": "Thinking, Fast and Slow",
        "description": "Nobel Prize winner Daniel Kahneman reveals two systems of thinking: fast intuitive and slow deliberate. A groundbreaking exploration of the mind.",
        "price": 18,
        "stock": 600,
        "category": "Books",
        "image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop"
    },
    {
        "name": "Yoga Mat Premium 6mm",
        "description": "Extra thick 6mm yoga mat with non-slip surface. Eco-friendly TPE material. Includes carrying strap. 72 x 24 inches.",
        "price": 35,
        "stock": 400,
        "category": "Sports & Outdoors",
        "image": "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop"
    },
    {
        "name": "Adjustable Dumbbell Set 50lb",
        "description": "Adjustable dumbbell pair from 5 to 50 lbs each. Quick-change weight system. Compact design replaces 15 sets of dumbbells.",
        "price": 299,
        "stock": 55,
        "category": "Sports & Outdoors",
        "image": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop"
    },
    {
        "name": "Hiking Backpack 40L",
        "description": "40-liter hiking backpack with rain cover. Ventilated back panel and padded hip belt. Multiple compartments and hydration compatible.",
        "price": 89,
        "stock": 120,
        "category": "Sports & Outdoors",
        "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop"
    },
    {
        "name": "Smart Fitness Watch Pro",
        "description": "GPS fitness tracker with heart rate monitoring, SpO2, sleep tracking. 14-day battery life. 100+ sport modes. 5ATM water resistant.",
        "price": 199,
        "stock": 95,
        "category": "Sports & Outdoors",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop"
    },
    {
        "name": "Vitamin C Serum with Hyaluronic Acid",
        "description": "Professional-grade vitamin C serum with 20% concentration. Brightens skin, reduces dark spots, and boosts collagen. Cruelty-free.",
        "price": 24,
        "stock": 600,
        "category": "Beauty & Personal Care",
        "image": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop"
    },
    {
        "name": "Electric Toothbrush Sonic Pro",
        "description": "40,000 vibrations per minute sonic toothbrush. 5 cleaning modes. Smart timer. USB-C charging. 30-day battery life. 4 brush heads included.",
        "price": 69,
        "stock": 200,
        "category": "Beauty & Personal Care",
        "image": "https://images.unsplash.com/photo-1559671145-31060e8a4bba?w=400&h=400&fit=crop"
    },
    {
        "name": "Luxury Perfume Collection",
        "description": "Set of 5 premium fragrance samples. Notes of bergamot, jasmine, vanilla, and sandalwood. Long-lasting formula. Elegant gift packaging.",
        "price": 85,
        "stock": 150,
        "category": "Beauty & Personal Care",
        "image": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop"
    },
    {
        "name": "LEGO Architecture Skyline",
        "description": "Build iconic city skylines from around the world. 600+ pieces. Ages 12+. Includes collector booklet with building details and history.",
        "price": 59,
        "stock": 180,
        "category": "Toys & Games",
        "image": "https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=400&h=400&fit=crop"
    },
    {
        "name": "Strategy Board Game Collection",
        "description": "Premium strategy board game for 2-6 players. 90-120 minute play time. Beautifully illustrated cards and wooden game pieces.",
        "price": 49,
        "stock": 200,
        "category": "Toys & Games",
        "image": "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400&h=400&fit=crop"
    },
    {
        "name": "RC Racing Drone 4K Camera",
        "description": "Racing drone with 4K UHD camera and 3-axis gimbal. 35-minute flight time. GPS return-to-home. Obstacle avoidance sensors.",
        "price": 399,
        "stock": 35,
        "category": "Toys & Games",
        "image": "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=400&h=400&fit=crop"
    },
]

def seed():
    print("Seeding database...")

    cat_map = {}
    for cat_name in CATEGORIES:
        existing = db.query(Category).filter(Category.name == cat_name).first()
        if existing:
            cat_map[cat_name] = existing.id
            print(f"  Category '{cat_name}' already exists (id={existing.id})")
        else:
            cat = Category(name=cat_name)
            db.add(cat)
            db.commit()
            db.refresh(cat)
            cat_map[cat_name] = cat.id
            print(f"  Created category '{cat_name}' (id={cat.id})")

    for p in PRODUCTS:
        existing = db.query(Product).filter(Product.name == p["name"]).first()
        if existing:
            existing.cover_image_url = p["image"]
            existing.description = p["description"]
            existing.price = p["price"]
            existing.stock = p["stock"]
            existing.category_id = cat_map[p["category"]]
            db.commit()
            print(f"  Updated product '{p['name']}'")
        else:
            product = Product(
                name=p["name"],
                description=p["description"],
                price=p["price"],
                stock=p["stock"],
                category_id=cat_map[p["category"]],
                cover_image_url=p["image"],
            )
            db.add(product)
            db.commit()
            print(f"  Created product '{p['name']}'")

    db.close()
    print(f"\nDone! Seeded {len(CATEGORIES)} categories and {len(PRODUCTS)} products.")

if __name__ == "__main__":
    seed()
