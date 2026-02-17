import random
import string
import requests
import json
import sys

BASE_URL = "http://127.0.0.1:8001"

def log(message):
    print(f"[TEST] {message}")

def test_root():
    log("Testing GET /")
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            log("SUCCESS: Root endpoint works.")
            print(response.json())
        else:
            log(f"FAILURE: Root endpoint returned {response.status_code}")
    except Exception as e:
        log(f"FAILURE: Could not connect to root endpoint. Error: {e}")
        sys.exit(1)

def test_create_product():
    log("Testing POST /products/")
    product_data = {
        "name": "Test Product",
        "description": "A product for testing",
        "price": 20,
        "stock": 100
    }
    try:
        response = requests.post(f"{BASE_URL}/products/", json=product_data)
        if response.status_code == 200:
            log("SUCCESS: Create product endpoint works.")
            return response.json()
        else:
            log(f"FAILURE: Create product endpoint returned {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        log(f"FAILURE: Error creating product. {e}")
        return None

def test_get_products():
    log("Testing GET /products/")
    try:
        response = requests.get(f"{BASE_URL}/products/")
        if response.status_code == 200:
            products = response.json()
            log(f"SUCCESS: Get products endpoint works. Found {len(products)} products.")
            return products
        else:
            log(f"FAILURE: Get products endpoint returned {response.status_code}")
            return []
    except Exception as e:
        log(f"FAILURE: Error getting products. {e}")
        return []

def test_get_product_detail(product_id):
    log(f"Testing GET /products/{product_id}")
    try:
        response = requests.get(f"{BASE_URL}/products/{product_id}")
        if response.status_code == 200:
            log("SUCCESS: Get product detail endpoint works.")
        else:
            log(f"FAILURE: Get product detail endpoint returned {response.status_code}")
    except Exception as e:
        log(f"FAILURE: Error getting product detail. {e}")



def get_random_string(length=8):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))

def test_create_user():
    log("Testing POST /users/")
    username = f"user_{get_random_string()}"
    email = f"{username}@example.com"
    password = "password123"
    
    user_data = {
        "username": username,
        "email": email,
        "password": password
    }
    
    try:
        response = requests.post(f"{BASE_URL}/users/", json=user_data)
        if response.status_code == 200:
            user = response.json()
            log(f"SUCCESS: Create user endpoint works. Created user {user['username']} (ID: {user['id']})")
            return user, password
        else:
            log(f"FAILURE: Create user endpoint returned {response.status_code}")
            print(response.text)
            return None, None
    except Exception as e:
        log(f"FAILURE: Error creating user. {e}")
        return None, None

def test_login(username, password):
    log(f"Testing POST /users/login with {username}")
    data = {"username": username, "password": password}
    try:
        response = requests.post(f"{BASE_URL}/users/login", data=data)
        if response.status_code == 200:
            token = response.json().get("access_token")
            log("SUCCESS: Login successful, got token.")
            return token
        else:
            log(f"FAILURE: Login endpoint returned {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        log(f"FAILURE: Error logging in. {e}")
        return None

def test_like_product(user_id, product_id, token):
    # Note: user_id is in path, token is currently NOT required by the endpoint based on previous code reading?
    # Let's check api/routers/users.py:
    # @router.post("/{user_id}/like/{product_id}")
    # def like_a_product(user_id: int, product_id: int, db: Session = Depends(get_db)):
    # NO security dependency on this endpoint! It's insecure but for now we follow the code.
    
    log(f"Testing POST /users/{user_id}/like/{product_id}")
    try:
        response = requests.post(f"{BASE_URL}/users/{user_id}/like/{product_id}")
        if response.status_code == 200:
             log("SUCCESS: Like endpoint works.")
        else:
             log(f"FAILURE: Like endpoint returned {response.status_code}")
             print(response.text)
    except Exception as e:
        log(f"FAILURE: Error calling like endpoint. {e}")

def run_tests():
    test_root()
    
    created_product = test_create_product()
    product_id = created_product['id'] if created_product else 1 
    if created_product:
        test_get_product_detail(product_id)
    
    test_get_products()
    
    created_user, password = test_create_user()
    if created_user:
        token = test_login(created_user['username'], password)
        if token and created_product:
            test_like_product(created_user['id'], product_id, token)
    else:
        log("Skipping login and like tests because user creation failed.")

if __name__ == "__main__":
    run_tests()
