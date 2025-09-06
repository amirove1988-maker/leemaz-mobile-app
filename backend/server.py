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
    id: str = Field(alias="_id")
    email: EmailStr
    full_name: str
    user_type: str
    language: str
    is_verified: bool = True  # Auto-verified now
    credits: int = 100  # Start with 100 credits
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True
    failed_login_attempts: int = 0
    last_failed_login: Optional[datetime] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

class EmailVerification(BaseModel):
    email: EmailStr
    code: str

class ShopCreate(BaseModel):
    name: str
    description: str
    category: str

class Shop(BaseModel):
    id: str = Field(alias="_id")
    name: str
    description: str
    category: str
    owner_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True
    is_approved: bool = False  # New field for admin approval
    approved_at: Optional[datetime] = None
    approved_by: Optional[str] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    category: str
    images: List[str] = []  # base64 encoded images
    shop_id: str

class Product(BaseModel):
    id: str = Field(alias="_id")
    name: str
    description: str
    price: float
    category: str
    images: List[str] = []
    shop_id: str
    seller_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True
    rating: float = 0.0
    review_count: int = 0

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

class ReviewCreate(BaseModel):
    product_id: str
    rating: int = Field(ge=1, le=5)
    comment: str

class Review(BaseModel):
    id: str = Field(alias="_id")
    product_id: str
    buyer_id: str
    rating: int
    comment: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

class ChatMessage(BaseModel):
    id: str = Field(alias="_id")
    sender_id: str
    receiver_id: str
    message: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_read: bool = False

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

# System Settings Model
class SystemSettings(BaseModel):
    id: str = Field(alias="_id")
    product_listing_cost: int = 50
    initial_user_credits: int = 100
    shop_approval_required: bool = True
    payment_method: str = "cash"  # cash, online, both
    platform_commission: float = 0.05  # 5% commission
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

# Notification Model
class NotificationCreate(BaseModel):
    user_id: str
    title: str
    message: str
    type: str = "general"  # general, shop_approved, new_message, etc.

class Notification(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    title: str
    message: str
    type: str
    is_read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

# Order Model for Cash Payments
class OrderCreate(BaseModel):
    product_id: str
    quantity: int = 1
    delivery_address: str
    phone_number: str
    payment_method: str = "cash"  # cash on delivery

class Order(BaseModel):
    id: str = Field(alias="_id")
    buyer_id: str
    seller_id: str
    product_id: str
    quantity: int
    total_amount: float
    delivery_address: str
    phone_number: str
    payment_method: str
    status: str = "pending"  # pending, confirmed, delivered, cancelled
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

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



# Authentication Routes
@api_router.post("/auth/register", response_model=dict)
async def register(user_data: UserCreate):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    hashed_password = get_password_hash(user_data.password)
    
    # Create user with auto-verification and 100 credits
    user_dict = user_data.dict()
    user_dict["password"] = hashed_password
    user_dict["created_at"] = datetime.utcnow()
    user_dict["is_verified"] = True  # Auto-verified
    user_dict["credits"] = 100  # Start with 100 credits
    user_dict["is_active"] = True
    user_dict["failed_login_attempts"] = 0
    
    result = await db.users.insert_one(user_dict)
    
    return {"message": "User registered successfully. You can now sign in!"}

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
    # Convert ObjectId to string for the response
    user_data = current_user.copy()
    user_data["_id"] = str(current_user["_id"])
    return User(**user_data)

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
    shop_dict["is_approved"] = False  # Requires admin approval
    shop_dict["approved_at"] = None
    shop_dict["approved_by"] = None
    
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
    # Only show approved shops to public
    shops = await db.shops.find({"is_active": True, "is_approved": True}).skip(skip).limit(limit).to_list(limit)
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

# Helper function to check if user is admin
async def check_admin_access(current_user: dict):
    # Admin check: email ends with @admin.leemaz.com or specific admin email
    admin_emails = ["admin@leemaz.com", "admin@admin.leemaz.com"]
    if current_user["email"] not in admin_emails and not current_user["email"].endswith("@admin.leemaz.com"):
        raise HTTPException(status_code=403, detail="Admin access required")
    return True

# Admin Routes (Comprehensive Admin Panel)
@api_router.get("/admin/dashboard")
async def admin_dashboard(current_user: dict = Depends(get_current_user)):
    await check_admin_access(current_user)
    
    # Get dashboard statistics
    total_users = await db.users.count_documents({})
    total_buyers = await db.users.count_documents({"user_type": "buyer"})
    total_sellers = await db.users.count_documents({"user_type": "seller"})
    
    total_shops = await db.shops.count_documents({})
    pending_shops = await db.shops.count_documents({"is_approved": False, "is_active": True})
    approved_shops = await db.shops.count_documents({"is_approved": True, "is_active": True})
    
    total_products = await db.products.count_documents({})
    active_products = await db.products.count_documents({"is_active": True})
    
    total_reviews = await db.reviews.count_documents({})
    
    return {
        "users": {
            "total": total_users,
            "buyers": total_buyers,
            "sellers": total_sellers
        },
        "shops": {
            "total": total_shops,
            "pending": pending_shops,
            "approved": approved_shops
        },
        "products": {
            "total": total_products,
            "active": active_products
        },
        "reviews": total_reviews
    }

@api_router.get("/admin/users")
async def get_all_users(current_user: dict = Depends(get_current_user), skip: int = 0, limit: int = 50):
    await check_admin_access(current_user)
    
    users = await db.users.find({}).skip(skip).limit(limit).sort("created_at", -1).to_list(limit)
    
    # Remove password field from response
    for user in users:
        user.pop("password", None)
    
    return users

@api_router.get("/admin/shops")
async def get_all_shops_admin(current_user: dict = Depends(get_current_user), status: str = "all"):
    await check_admin_access(current_user)
    
    # Filter shops based on status
    filter_dict = {}
    if status == "pending":
        filter_dict = {"is_approved": False, "is_active": True}
    elif status == "approved":
        filter_dict = {"is_approved": True, "is_active": True}
    elif status == "rejected":
        filter_dict = {"is_active": False}
    
    shops = await db.shops.find(filter_dict).sort("created_at", -1).to_list(100)
    
    # Add owner information to each shop
    for shop in shops:
        owner = await db.users.find_one({"_id": shop["owner_id"]})
        if owner:
            shop["owner_name"] = owner["full_name"]
            shop["owner_email"] = owner["email"]
    
    return shops

@api_router.post("/admin/shops/{shop_id}/approve")
async def approve_shop(shop_id: str, current_user: dict = Depends(get_current_user)):
    await check_admin_access(current_user)
    
    # Find the shop
    shop = await db.shops.find_one({"_id": ObjectId(shop_id)})
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    
    # Update shop approval status
    await db.shops.update_one(
        {"_id": ObjectId(shop_id)},
        {
            "$set": {
                "is_approved": True,
                "approved_at": datetime.utcnow(),
                "approved_by": current_user["_id"],
                "is_active": True
            }
        }
    )
    
    return {"message": "Shop approved successfully"}

@api_router.post("/admin/shops/{shop_id}/reject")
async def reject_shop(shop_id: str, reason: str = "Not meeting quality standards", current_user: dict = Depends(get_current_user)):
    await check_admin_access(current_user)
    
    # Find the shop
    shop = await db.shops.find_one({"_id": ObjectId(shop_id)})
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    
    # Update shop status to rejected
    await db.shops.update_one(
        {"_id": ObjectId(shop_id)},
        {
            "$set": {
                "is_approved": False,
                "is_active": False,
                "rejected_at": datetime.utcnow(),
                "rejected_by": current_user["_id"],
                "rejection_reason": reason
            }
        }
    )
    
    return {"message": "Shop rejected successfully"}

@api_router.get("/admin/products")
async def get_all_products_admin(current_user: dict = Depends(get_current_user)):
    await check_admin_access(current_user)
    
    products = await db.products.find({}).sort("created_at", -1).limit(100).to_list(100)
    
    # Add seller and shop information
    for product in products:
        seller = await db.users.find_one({"_id": product["seller_id"]})
        shop = await db.shops.find_one({"_id": product["shop_id"]})
        
        if seller:
            product["seller_name"] = seller["full_name"]
            product["seller_email"] = seller["email"]
        
        if shop:
            product["shop_name"] = shop["name"]
    
    return products

@api_router.post("/admin/users/{user_id}/toggle-status")
async def toggle_user_status(user_id: str, current_user: dict = Depends(get_current_user)):
    await check_admin_access(current_user)
    
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Toggle user active status
    new_status = not user.get("is_active", True)
    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"is_active": new_status}}
    )
    
    action = "activated" if new_status else "deactivated"
    return {"message": f"User {action} successfully"}

@api_router.post("/admin/users/{user_id}/credits")
async def add_credits_to_user_admin(user_id: str, credits: int, current_user: dict = Depends(get_current_user)):
    await check_admin_access(current_user)
    
    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$inc": {"credits": credits}}
    )
    
    # Log transaction
    await db.credit_transactions.insert_one({
        "user_id": ObjectId(user_id),
        "amount": credits,
        "type": "admin_add",
        "description": f"Credits {'added' if credits > 0 else 'deducted'} by admin",
        "admin_id": current_user["_id"],
        "created_at": datetime.utcnow()
    })
    
    action = "added" if credits > 0 else "deducted"
    return {"message": f"{abs(credits)} credits {action} successfully"}

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