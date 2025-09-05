from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
from dotenv import load_dotenv
import os
import logging
import uuid
import base64
import io
import secrets
from pathlib import Path
from bson import ObjectId
import asyncio

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'leemaz')]

# Security setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.environ.get("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
security = HTTPBearer()

# FastAPI setup
app = FastAPI(title="Leemaz E-commerce API", version="1.0.0")
api_router = APIRouter(prefix="/api")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Custom ObjectId handler for MongoDB
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError('Invalid objectid')
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type='string')
        return field_schema

# Pydantic Models
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    user_type: str = "buyer"  # buyer or seller
    language: str = "en"  # en or ar

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    email: EmailStr
    full_name: str
    user_type: str
    language: str
    is_verified: bool = False
    credits: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True
    failed_login_attempts: int = 0
    last_failed_login: Optional[datetime] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class EmailVerification(BaseModel):
    email: EmailStr
    code: str

class ShopCreate(BaseModel):
    name: str
    description: str
    category: str

class Shop(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    description: str
    category: str
    owner_id: PyObjectId
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    category: str
    images: List[str] = []  # base64 encoded images
    shop_id: str

class Product(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    description: str
    price: float
    category: str
    images: List[str] = []
    shop_id: PyObjectId
    seller_id: PyObjectId
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True
    rating: float = 0.0
    review_count: int = 0

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class ReviewCreate(BaseModel):
    product_id: str
    rating: int = Field(ge=1, le=5)
    comment: str

class Review(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    product_id: PyObjectId
    buyer_id: PyObjectId
    rating: int
    comment: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class ChatMessage(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    sender_id: PyObjectId
    receiver_id: PyObjectId
    message: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_read: bool = False

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class ChatMessageCreate(BaseModel):
    receiver_id: str
    message: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Helper Functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise credentials_exception
    return user

def generate_verification_code():
    return str(secrets.randbelow(999999)).zfill(6)

async def send_verification_email(email: str, code: str):
    # Simple email implementation - replace with actual SMTP configuration
    logger.info(f"Verification code for {email}: {code}")
    # Store verification code in database
    await db.verification_codes.insert_one({
        "email": email,
        "code": code,
        "created_at": datetime.utcnow(),
        "expires_at": datetime.utcnow() + timedelta(minutes=10)
    })

# Authentication Routes
@api_router.post("/auth/register", response_model=dict)
async def register(user_data: UserCreate):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    hashed_password = get_password_hash(user_data.password)
    
    # Create user
    user_dict = user_data.dict()
    user_dict["password"] = hashed_password
    user_dict["created_at"] = datetime.utcnow()
    user_dict["is_verified"] = False
    user_dict["credits"] = 0
    user_dict["is_active"] = True
    user_dict["failed_login_attempts"] = 0
    
    result = await db.users.insert_one(user_dict)
    
    # Send verification email
    verification_code = generate_verification_code()
    await send_verification_email(user_data.email, verification_code)
    
    return {"message": "User registered successfully. Please check your email for verification code."}

@api_router.post("/auth/verify-email")
async def verify_email(verification: EmailVerification):
    # Check verification code
    code_doc = await db.verification_codes.find_one({
        "email": verification.email,
        "code": verification.code,
        "expires_at": {"$gt": datetime.utcnow()}
    })
    
    if not code_doc:
        raise HTTPException(status_code=400, detail="Invalid or expired verification code")
    
    # Update user as verified and add initial credits
    await db.users.update_one(
        {"email": verification.email},
        {"$set": {"is_verified": True, "credits": 100}}
    )
    
    # Delete verification code
    await db.verification_codes.delete_one({"_id": code_doc["_id"]})
    
    return {"message": "Email verified successfully. You've received 100 free credits!"}

@api_router.post("/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    user = await db.users.find_one({"email": user_data.email})
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Check if account is locked
    if user.get("failed_login_attempts", 0) >= 5:
        last_failed = user.get("last_failed_login")
        if last_failed and datetime.utcnow() - last_failed < timedelta(minutes=30):
            raise HTTPException(status_code=423, detail="Account locked due to too many failed attempts")
    
    if not verify_password(user_data.password, user["password"]):
        # Update failed login attempts
        await db.users.update_one(
            {"_id": user["_id"]},
            {
                "$inc": {"failed_login_attempts": 1},
                "$set": {"last_failed_login": datetime.utcnow()}
            }
        )
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not user.get("is_verified", False):
        raise HTTPException(status_code=401, detail="Please verify your email first")
    
    # Reset failed login attempts on successful login
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"failed_login_attempts": 0, "last_failed_login": None}}
    )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user["_id"])}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.get("/auth/me", response_model=User)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return User(**current_user)

# Shop Routes
@api_router.post("/shops", response_model=Shop)
async def create_shop(shop_data: ShopCreate, current_user: dict = Depends(get_current_user)):
    if current_user["user_type"] != "seller":
        raise HTTPException(status_code=403, detail="Only sellers can create shops")
    
    # Check if user already has a shop
    existing_shop = await db.shops.find_one({"owner_id": current_user["_id"]})
    if existing_shop:
        raise HTTPException(status_code=400, detail="You already have a shop")
    
    shop_dict = shop_data.dict()
    shop_dict["owner_id"] = current_user["_id"]
    shop_dict["created_at"] = datetime.utcnow()
    shop_dict["is_active"] = True
    
    result = await db.shops.insert_one(shop_dict)
    shop_dict["_id"] = result.inserted_id
    
    return Shop(**shop_dict)

@api_router.get("/shops/my", response_model=Shop)
async def get_my_shop(current_user: dict = Depends(get_current_user)):
    shop = await db.shops.find_one({"owner_id": current_user["_id"]})
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    return Shop(**shop)

@api_router.get("/shops", response_model=List[Shop])
async def get_shops(skip: int = 0, limit: int = 20):
    shops = await db.shops.find({"is_active": True}).skip(skip).limit(limit).to_list(limit)
    return [Shop(**shop) for shop in shops]

# Product Routes
@api_router.post("/products", response_model=Product)
async def create_product(product_data: ProductCreate, current_user: dict = Depends(get_current_user)):
    if current_user["user_type"] != "seller":
        raise HTTPException(status_code=403, detail="Only sellers can create products")
    
    # Check if user has enough credits
    if current_user["credits"] < 50:
        raise HTTPException(status_code=400, detail="Insufficient credits. You need 50 credits to list a product.")
    
    # Verify shop ownership
    shop = await db.shops.find_one({"_id": ObjectId(product_data.shop_id), "owner_id": current_user["_id"]})
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found or not owned by you")
    
    # Deduct credits
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$inc": {"credits": -50}}
    )
    
    product_dict = product_data.dict()
    product_dict["shop_id"] = ObjectId(product_data.shop_id)
    product_dict["seller_id"] = current_user["_id"]
    product_dict["created_at"] = datetime.utcnow()
    product_dict["is_active"] = True
    product_dict["rating"] = 0.0
    product_dict["review_count"] = 0
    
    result = await db.products.insert_one(product_dict)
    product_dict["_id"] = result.inserted_id
    
    return Product(**product_dict)

@api_router.get("/products", response_model=List[Product])
async def get_products(skip: int = 0, limit: int = 20, category: Optional[str] = None):
    filter_dict = {"is_active": True}
    if category:
        filter_dict["category"] = category
    
    products = await db.products.find(filter_dict).skip(skip).limit(limit).to_list(limit)
    return [Product(**product) for product in products]

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"_id": ObjectId(product_id), "is_active": True})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return Product(**product)

# Review Routes
@api_router.post("/reviews", response_model=Review)
async def create_review(review_data: ReviewCreate, current_user: dict = Depends(get_current_user)):
    if current_user["user_type"] != "buyer":
        raise HTTPException(status_code=403, detail="Only buyers can write reviews")
    
    # Check if product exists
    product = await db.products.find_one({"_id": ObjectId(review_data.product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if user already reviewed this product
    existing_review = await db.reviews.find_one({
        "product_id": ObjectId(review_data.product_id),
        "buyer_id": current_user["_id"]
    })
    if existing_review:
        raise HTTPException(status_code=400, detail="You have already reviewed this product")
    
    review_dict = review_data.dict()
    review_dict["product_id"] = ObjectId(review_data.product_id)
    review_dict["buyer_id"] = current_user["_id"]
    review_dict["created_at"] = datetime.utcnow()
    
    result = await db.reviews.insert_one(review_dict)
    review_dict["_id"] = result.inserted_id
    
    # Update product rating
    await update_product_rating(ObjectId(review_data.product_id))
    
    return Review(**review_dict)

async def update_product_rating(product_id: ObjectId):
    # Calculate average rating
    pipeline = [
        {"$match": {"product_id": product_id}},
        {"$group": {"_id": None, "avg_rating": {"$avg": "$rating"}, "count": {"$sum": 1}}}
    ]
    result = await db.reviews.aggregate(pipeline).to_list(1)
    
    if result:
        avg_rating = round(result[0]["avg_rating"], 1)
        count = result[0]["count"]
        await db.products.update_one(
            {"_id": product_id},
            {"$set": {"rating": avg_rating, "review_count": count}}
        )

@api_router.get("/products/{product_id}/reviews", response_model=List[Review])
async def get_product_reviews(product_id: str, skip: int = 0, limit: int = 10):
    reviews = await db.reviews.find({"product_id": ObjectId(product_id)}).skip(skip).limit(limit).to_list(limit)
    return [Review(**review) for review in reviews]

# Chat Routes
@api_router.post("/chat/messages", response_model=ChatMessage)
async def send_message(message_data: ChatMessageCreate, current_user: dict = Depends(get_current_user)):
    message_dict = message_data.dict()
    message_dict["sender_id"] = current_user["_id"]
    message_dict["receiver_id"] = ObjectId(message_data.receiver_id)
    message_dict["created_at"] = datetime.utcnow()
    message_dict["is_read"] = False
    
    result = await db.chat_messages.insert_one(message_dict)
    message_dict["_id"] = result.inserted_id
    
    return ChatMessage(**message_dict)

@api_router.get("/chat/conversations")
async def get_conversations(current_user: dict = Depends(get_current_user)):
    # Get list of users who have chatted with current user
    pipeline = [
        {"$match": {"$or": [{"sender_id": current_user["_id"]}, {"receiver_id": current_user["_id"]}]}},
        {"$sort": {"created_at": -1}},
        {"$group": {
            "_id": {
                "$cond": [
                    {"$eq": ["$sender_id", current_user["_id"]]},
                    "$receiver_id",
                    "$sender_id"
                ]
            },
            "last_message": {"$first": "$message"},
            "last_message_time": {"$first": "$created_at"},
            "unread_count": {
                "$sum": {
                    "$cond": [
                        {"$and": [{"$eq": ["$receiver_id", current_user["_id"]]}, {"$eq": ["$is_read", False]}]},
                        1,
                        0
                    ]
                }
            }
        }}
    ]
    
    conversations = await db.chat_messages.aggregate(pipeline).to_list(None)
    
    # Get user details for each conversation
    for conv in conversations:
        user = await db.users.find_one({"_id": conv["_id"]})
        conv["user"] = {"id": str(user["_id"]), "full_name": user["full_name"]}
    
    return conversations

@api_router.get("/chat/messages/{user_id}")
async def get_chat_messages(user_id: str, current_user: dict = Depends(get_current_user), skip: int = 0, limit: int = 50):
    messages = await db.chat_messages.find({
        "$or": [
            {"sender_id": current_user["_id"], "receiver_id": ObjectId(user_id)},
            {"sender_id": ObjectId(user_id), "receiver_id": current_user["_id"]}
        ]
    }).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    
    # Mark messages as read
    await db.chat_messages.update_many(
        {"sender_id": ObjectId(user_id), "receiver_id": current_user["_id"], "is_read": False},
        {"$set": {"is_read": True}}
    )
    
    return [ChatMessage(**msg) for msg in messages]

# Favorites Routes
@api_router.post("/favorites/{product_id}")
async def add_to_favorites(product_id: str, current_user: dict = Depends(get_current_user)):
    # Check if product exists
    product = await db.products.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if already in favorites
    favorite = await db.favorites.find_one({
        "user_id": current_user["_id"],
        "product_id": ObjectId(product_id)
    })
    
    if favorite:
        raise HTTPException(status_code=400, detail="Product already in favorites")
    
    await db.favorites.insert_one({
        "user_id": current_user["_id"],
        "product_id": ObjectId(product_id),
        "created_at": datetime.utcnow()
    })
    
    return {"message": "Product added to favorites"}

@api_router.delete("/favorites/{product_id}")
async def remove_from_favorites(product_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.favorites.delete_one({
        "user_id": current_user["_id"],
        "product_id": ObjectId(product_id)
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not in favorites")
    
    return {"message": "Product removed from favorites"}

@api_router.get("/favorites", response_model=List[Product])
async def get_favorites(current_user: dict = Depends(get_current_user)):
    favorites = await db.favorites.find({"user_id": current_user["_id"]}).to_list(None)
    product_ids = [fav["product_id"] for fav in favorites]
    
    products = await db.products.find({"_id": {"$in": product_ids}, "is_active": True}).to_list(None)
    return [Product(**product) for product in products]

# Credits Routes
@api_router.get("/credits/balance")
async def get_credit_balance(current_user: dict = Depends(get_current_user)):
    return {"credits": current_user["credits"]}

@api_router.get("/credits/transactions")
async def get_credit_transactions(current_user: dict = Depends(get_current_user)):
    transactions = await db.credit_transactions.find({"user_id": current_user["_id"]}).sort("created_at", -1).to_list(50)
    return transactions

# Admin Routes (simplified)
@api_router.get("/admin/users")
async def get_all_users(current_user: dict = Depends(get_current_user)):
    # Simple admin check - in production, use proper role-based access
    if current_user["email"] != "admin@leemaz.com":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    users = await db.users.find().to_list(100)
    return [User(**user) for user in users]

@api_router.post("/admin/users/{user_id}/credits")
async def add_credits_to_user(user_id: str, credits: int, current_user: dict = Depends(get_current_user)):
    if current_user["email"] != "admin@leemaz.com":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$inc": {"credits": credits}}
    )
    
    # Log transaction
    await db.credit_transactions.insert_one({
        "user_id": ObjectId(user_id),
        "amount": credits,
        "type": "admin_add",
        "description": "Credits added by admin",
        "created_at": datetime.utcnow()
    })
    
    return {"message": f"Added {credits} credits to user"}

# Health check
@api_router.get("/health")
async def health_check():
    return {"status": "healthy"}

# Include router
app.include_router(api_router)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)