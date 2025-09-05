#!/usr/bin/env python3
"""
Final Backend API Test for Leemaz E-commerce Platform
Tests all major backend functionality with proper error handling
"""

import requests
import json
import os
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.getenv('EXPO_PUBLIC_BACKEND_URL', 'http://localhost:8001')
API_BASE = f"{BACKEND_URL}/api"

print(f"Testing backend at: {API_BASE}")

def test_api():
    """Test all major API functionality"""
    
    results = {
        "health_check": False,
        "user_registration": False,
        "email_verification_security": False,
        "login_security": False,
        "authentication_protection": False,
        "shop_management": False,
        "product_management": False,
        "review_system": False,
        "chat_system": False,
        "favorites_system": False,
        "credit_system": False,
        "admin_functions": False,
        "error_handling": False
    }
    
    print("=" * 60)
    print("LEEMAZ E-COMMERCE BACKEND API TEST SUITE")
    print("=" * 60)
    
    # 1. Health Check
    print("\n1. Testing Health Check...")
    try:
        response = requests.get(f"{API_BASE}/health", timeout=10)
        if response.status_code == 200:
            results["health_check"] = True
            print("✅ Health check passed")
        else:
            print(f"❌ Health check failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Health check error: {e}")
    
    # 2. User Registration
    print("\n2. Testing User Registration...")
    try:
        # Test buyer registration
        buyer_data = {
            "email": "testbuyer@leemaz.com",
            "password": "SecurePass123!",
            "full_name": "Test Buyer",
            "user_type": "buyer",
            "language": "en"
        }
        
        response = requests.post(f"{API_BASE}/auth/register", json=buyer_data, timeout=10)
        buyer_success = response.status_code == 200
        
        # Test seller registration
        seller_data = {
            "email": "testseller@leemaz.com",
            "password": "SecurePass456!",
            "full_name": "Test Seller",
            "user_type": "seller",
            "language": "en"
        }
        
        response = requests.post(f"{API_BASE}/auth/register", json=seller_data, timeout=10)
        seller_success = response.status_code == 200
        
        # Test duplicate registration
        response = requests.post(f"{API_BASE}/auth/register", json=buyer_data, timeout=10)
        duplicate_blocked = response.status_code == 400
        
        if buyer_success and seller_success and duplicate_blocked:
            results["user_registration"] = True
            print("✅ User registration system working correctly")
        else:
            print(f"❌ User registration issues: buyer={buyer_success}, seller={seller_success}, duplicate_blocked={duplicate_blocked}")
            
    except Exception as e:
        print(f"❌ User registration error: {e}")
    
    # 3. Email Verification Security
    print("\n3. Testing Email Verification Security...")
    try:
        # Test invalid verification code
        verification_data = {
            "email": "testbuyer@leemaz.com",
            "code": "000000"
        }
        
        response = requests.post(f"{API_BASE}/auth/verify-email", json=verification_data, timeout=10)
        if response.status_code == 400:
            results["email_verification_security"] = True
            print("✅ Email verification security working")
        else:
            print(f"❌ Email verification security failed: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Email verification error: {e}")
    
    # 4. Login Security
    print("\n4. Testing Login Security...")
    try:
        # Test login with unverified account
        login_data = {
            "email": "testbuyer@leemaz.com",
            "password": "SecurePass123!"
        }
        
        response = requests.post(f"{API_BASE}/auth/login", json=login_data, timeout=10)
        unverified_blocked = response.status_code == 401
        
        # Test invalid credentials
        invalid_login = {
            "email": "testbuyer@leemaz.com",
            "password": "WrongPassword"
        }
        
        response = requests.post(f"{API_BASE}/auth/login", json=invalid_login, timeout=10)
        invalid_blocked = response.status_code == 401
        
        if unverified_blocked and invalid_blocked:
            results["login_security"] = True
            print("✅ Login security working correctly")
        else:
            print(f"❌ Login security issues: unverified_blocked={unverified_blocked}, invalid_blocked={invalid_blocked}")
            
    except Exception as e:
        print(f"❌ Login security error: {e}")
    
    # 5. Authentication Protection
    print("\n5. Testing Authentication Protection...")
    try:
        # Test protected endpoint without token
        response = requests.get(f"{API_BASE}/auth/me", timeout=10)
        auth_protected = response.status_code in [401, 403]
        
        if auth_protected:
            results["authentication_protection"] = True
            print("✅ Authentication protection working")
        else:
            print(f"❌ Authentication protection failed: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Authentication protection error: {e}")
    
    # 6. Shop Management
    print("\n6. Testing Shop Management...")
    try:
        # Test shop creation without auth (should fail)
        shop_data = {
            "name": "Test Shop",
            "description": "Test Description",
            "category": "Electronics"
        }
        
        response = requests.post(f"{API_BASE}/shops", json=shop_data, timeout=10)
        shop_auth_required = response.status_code in [401, 403]
        
        # Test shop listing (should work)
        response = requests.get(f"{API_BASE}/shops", timeout=10)
        shop_listing_works = response.status_code == 200
        
        if shop_auth_required and shop_listing_works:
            results["shop_management"] = True
            print("✅ Shop management working correctly")
        else:
            print(f"❌ Shop management issues: auth_required={shop_auth_required}, listing_works={shop_listing_works}")
            
    except Exception as e:
        print(f"❌ Shop management error: {e}")
    
    # 7. Product Management
    print("\n7. Testing Product Management...")
    try:
        # Test product creation without auth (should fail)
        product_data = {
            "name": "Test Product",
            "description": "Test Description",
            "price": 99.99,
            "category": "Electronics",
            "images": [],
            "shop_id": "507f1f77bcf86cd799439011"
        }
        
        response = requests.post(f"{API_BASE}/products", json=product_data, timeout=10)
        product_auth_required = response.status_code in [401, 403]
        
        # Test product listing (should work)
        response = requests.get(f"{API_BASE}/products", timeout=10)
        product_listing_works = response.status_code == 200
        
        # Test product filtering
        response = requests.get(f"{API_BASE}/products?category=Electronics", timeout=10)
        product_filtering_works = response.status_code == 200
        
        if product_auth_required and product_listing_works and product_filtering_works:
            results["product_management"] = True
            print("✅ Product management working correctly")
        else:
            print(f"❌ Product management issues: auth_required={product_auth_required}, listing={product_listing_works}, filtering={product_filtering_works}")
            
    except Exception as e:
        print(f"❌ Product management error: {e}")
    
    # 8. Review System
    print("\n8. Testing Review System...")
    try:
        # Test review creation without auth (should fail)
        review_data = {
            "product_id": "507f1f77bcf86cd799439011",
            "rating": 5,
            "comment": "Great product!"
        }
        
        response = requests.post(f"{API_BASE}/reviews", json=review_data, timeout=10)
        review_auth_required = response.status_code in [401, 403]
        
        # Test review listing (should work)
        response = requests.get(f"{API_BASE}/products/507f1f77bcf86cd799439011/reviews", timeout=10)
        review_listing_works = response.status_code == 200
        
        if review_auth_required and review_listing_works:
            results["review_system"] = True
            print("✅ Review system working correctly")
        else:
            print(f"❌ Review system issues: auth_required={review_auth_required}, listing_works={review_listing_works}")
            
    except Exception as e:
        print(f"❌ Review system error: {e}")
    
    # 9. Chat System
    print("\n9. Testing Chat System...")
    try:
        # Test message sending without auth (should fail)
        message_data = {
            "receiver_id": "507f1f77bcf86cd799439011",
            "message": "Hello!"
        }
        
        response = requests.post(f"{API_BASE}/chat/messages", json=message_data, timeout=10)
        chat_auth_required = response.status_code in [401, 403]
        
        # Test conversations without auth (should fail)
        response = requests.get(f"{API_BASE}/chat/conversations", timeout=10)
        conversations_auth_required = response.status_code in [401, 403]
        
        if chat_auth_required and conversations_auth_required:
            results["chat_system"] = True
            print("✅ Chat system security working correctly")
        else:
            print(f"❌ Chat system issues: messages_auth={chat_auth_required}, conversations_auth={conversations_auth_required}")
            
    except Exception as e:
        print(f"❌ Chat system error: {e}")
    
    # 10. Favorites System
    print("\n10. Testing Favorites System...")
    try:
        # Test favorites without auth (should fail)
        response = requests.post(f"{API_BASE}/favorites/507f1f77bcf86cd799439011", timeout=10)
        favorites_add_auth = response.status_code in [401, 403]
        
        response = requests.get(f"{API_BASE}/favorites", timeout=10)
        favorites_list_auth = response.status_code in [401, 403]
        
        if favorites_add_auth and favorites_list_auth:
            results["favorites_system"] = True
            print("✅ Favorites system security working correctly")
        else:
            print(f"❌ Favorites system issues: add_auth={favorites_add_auth}, list_auth={favorites_list_auth}")
            
    except Exception as e:
        print(f"❌ Favorites system error: {e}")
    
    # 11. Credit System
    print("\n11. Testing Credit System...")
    try:
        # Test credit endpoints without auth (should fail)
        response = requests.get(f"{API_BASE}/credits/balance", timeout=10)
        credits_balance_auth = response.status_code in [401, 403]
        
        response = requests.get(f"{API_BASE}/credits/transactions", timeout=10)
        credits_transactions_auth = response.status_code in [401, 403]
        
        if credits_balance_auth and credits_transactions_auth:
            results["credit_system"] = True
            print("✅ Credit system security working correctly")
        else:
            print(f"❌ Credit system issues: balance_auth={credits_balance_auth}, transactions_auth={credits_transactions_auth}")
            
    except Exception as e:
        print(f"❌ Credit system error: {e}")
    
    # 12. Admin Functions
    print("\n12. Testing Admin Functions...")
    try:
        # Test admin endpoints without auth (should fail)
        response = requests.get(f"{API_BASE}/admin/users", timeout=10)
        admin_users_auth = response.status_code in [401, 403]
        
        response = requests.post(f"{API_BASE}/admin/users/507f1f77bcf86cd799439011/credits", json={"credits": 100}, timeout=10)
        admin_credits_auth = response.status_code in [401, 403]
        
        if admin_users_auth and admin_credits_auth:
            results["admin_functions"] = True
            print("✅ Admin functions security working correctly")
        else:
            print(f"❌ Admin functions issues: users_auth={admin_users_auth}, credits_auth={admin_credits_auth}")
            
    except Exception as e:
        print(f"❌ Admin functions error: {e}")
    
    # 13. Error Handling
    print("\n13. Testing Error Handling...")
    try:
        # Test invalid endpoint
        response = requests.get(f"{API_BASE}/invalid-endpoint", timeout=10)
        invalid_endpoint_handled = response.status_code == 404
        
        # Test malformed JSON
        response = requests.post(f"{API_BASE}/auth/register", data="invalid json", headers={"Content-Type": "application/json"}, timeout=10)
        malformed_handled = response.status_code in [400, 422]
        
        if invalid_endpoint_handled and malformed_handled:
            results["error_handling"] = True
            print("✅ Error handling working correctly")
        else:
            print(f"❌ Error handling issues: invalid_endpoint={invalid_endpoint_handled}, malformed={malformed_handled}")
            
    except Exception as e:
        print(f"❌ Error handling error: {e}")
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    passed_tests = sum(results.values())
    total_tests = len(results)
    
    print(f"Total Tests: {total_tests}")
    print(f"Passed: {passed_tests}")
    print(f"Failed: {total_tests - passed_tests}")
    print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
    
    print("\nDetailed Results:")
    for test_name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  {status} {test_name.replace('_', ' ').title()}")
    
    if passed_tests == total_tests:
        print("\n🎉 ALL TESTS PASSED! Backend API is working correctly.")
        print("✅ All authentication and security measures are working")
        print("✅ All endpoints are properly protected")
        print("✅ Public endpoints are accessible")
        print("✅ Error handling is robust")
    else:
        print(f"\n⚠️  {total_tests - passed_tests} tests failed.")
        print("Please review the failed tests above.")
    
    return results

if __name__ == "__main__":
    test_api()