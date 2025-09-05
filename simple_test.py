#!/usr/bin/env python3
"""
Simple Backend API Test for Leemaz E-commerce Platform
"""

import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.getenv('EXPO_PUBLIC_BACKEND_URL', 'http://localhost:8001')
API_BASE = f"{BACKEND_URL}/api"

print(f"Testing backend at: {API_BASE}")

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get(f"{API_BASE}/health")
        print(f"Health Check: {response.status_code} - {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health Check Failed: {e}")
        return False

def test_registration():
    """Test user registration"""
    user_data = {
        "email": "test.user@leemaz.com",
        "password": "TestPass123!",
        "full_name": "Test User",
        "user_type": "buyer",
        "language": "en"
    }
    
    try:
        response = requests.post(f"{API_BASE}/auth/register", json=user_data)
        print(f"Registration: {response.status_code} - {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Registration Failed: {e}")
        return False

def test_products():
    """Test product listing"""
    try:
        response = requests.get(f"{API_BASE}/products")
        print(f"Products: {response.status_code} - Found {len(response.json())} products")
        return response.status_code == 200
    except Exception as e:
        print(f"Products Failed: {e}")
        return False

def test_auth_protection():
    """Test authentication protection"""
    try:
        response = requests.get(f"{API_BASE}/auth/me")
        print(f"Auth Protection: {response.status_code} - Correctly blocked unauthorized access")
        return response.status_code == 401
    except Exception as e:
        print(f"Auth Protection Failed: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("SIMPLE BACKEND API TEST")
    print("=" * 50)
    
    tests = [
        ("Health Check", test_health),
        ("User Registration", test_registration),
        ("Product Listing", test_products),
        ("Auth Protection", test_auth_protection)
    ]
    
    results = []
    for name, test_func in tests:
        print(f"\nTesting: {name}")
        result = test_func()
        results.append(result)
        print(f"Result: {'✅ PASS' if result else '❌ FAIL'}")
    
    passed = sum(results)
    total = len(results)
    
    print("\n" + "=" * 50)
    print("SUMMARY")
    print("=" * 50)
    print(f"Passed: {passed}/{total}")
    print(f"Success Rate: {(passed/total)*100:.1f}%")