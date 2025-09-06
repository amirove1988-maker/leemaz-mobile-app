#!/usr/bin/env python3
"""
Script to create admin user for Leemaz e-commerce platform
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from datetime import datetime
from dotenv import load_dotenv
import os
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'leemaz')]

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_admin_user():
    """Create admin user if not exists"""
    admin_email = "admin@leemaz.com"
    admin_password = "admin123"  # Change this in production!
    
    # Check if admin already exists
    existing_admin = await db.users.find_one({"email": admin_email})
    if existing_admin:
        print(f"✅ Admin user already exists: {admin_email}")
        return
    
    # Hash password
    hashed_password = pwd_context.hash(admin_password)
    
    # Create admin user
    admin_user = {
        "email": admin_email,
        "password": hashed_password,
        "full_name": "Leemaz Administrator",
        "user_type": "admin",
        "language": "en",
        "is_verified": True,
        "credits": 999999,  # Unlimited credits for admin
        "created_at": datetime.utcnow(),
        "is_active": True,
        "failed_login_attempts": 0,
        "is_admin": True
    }
    
    result = await db.users.insert_one(admin_user)
    print(f"🎉 Admin user created successfully!")
    print(f"📧 Email: {admin_email}")
    print(f"🔑 Password: {admin_password}")
    print(f"🆔 User ID: {result.inserted_id}")
    print(f"\n⚠️  IMPORTANT: Change the admin password after first login!")

async def main():
    print("🔧 Creating Leemaz Admin User...")
    try:
        await create_admin_user()
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())