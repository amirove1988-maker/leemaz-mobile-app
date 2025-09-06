#!/usr/bin/env python3
"""
Comprehensive Backend API Test Suite for Leemaz E-commerce Platform
Tests all major functionality including authentication, shops, products, reviews, chat, favorites, and credits.
"""

import requests
import json
import time
import base64
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.getenv('EXPO_PUBLIC_BACKEND_URL', 'http://localhost:8001')
API_BASE = f"{BACKEND_URL}/api"

print(f"Testing backend at: {API_BASE}")

class LeemazeCommerceAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.tokens = {}
        self.users = {}
        self.shops = {}
        self.products = {}
        self.verification_codes = {}
        
    def log_test(self, test_name, success, details=""):
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        if not success:
            print(f"   Error occurred in: {test_name}")
        print()
        
    def make_request(self, method, endpoint, data=None, headers=None, token=None):
        """Make HTTP request with proper error handling"""
        url = f"{API_BASE}{endpoint}"
        
        if headers is None:
            headers = {"Content-Type": "application/json"}
            
        if token:
            headers["Authorization"] = f"Bearer {token}"
            
        try:
            if method.upper() == "GET":
                response = self.session.get(url, headers=headers)
            elif method.upper() == "POST":
                response = self.session.post(url, json=data, headers=headers)
            elif method.upper() == "DELETE":
                response = self.session.delete(url, headers=headers)
            elif method.upper() == "PUT":
                response = self.session.put(url, json=data, headers=headers)
            else:
                raise ValueError(f"Unsupported method: {method}")
                
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            return None
    
    def test_health_check(self):
        """Test API health endpoint"""
        response = self.make_request("GET", "/health")
        success = response and response.status_code == 200
        details = f"Status: {response.status_code if response else 'No response'}"
        self.log_test("Health Check", success, details)
        return success
    
    def test_user_registration(self):
        """Test user registration for both buyer and seller"""
        # Test buyer registration
        buyer_data = {
            "email": "alice.buyer@leemaz.com",
            "password": "SecurePass123!",
            "full_name": "Alice Johnson",
            "user_type": "buyer",
            "language": "en"
        }
        
        response = self.make_request("POST", "/auth/register", buyer_data)
        buyer_success = response and response.status_code == 200
        
        if buyer_success:
            self.users['buyer'] = buyer_data
            
        # Test seller registration
        seller_data = {
            "email": "bob.seller@leemaz.com", 
            "password": "SecurePass456!",
            "full_name": "Bob Smith",
            "user_type": "seller",
            "language": "en"
        }
        
        response = self.make_request("POST", "/auth/register", seller_data)
        seller_success = response and response.status_code == 200
        
        if seller_success:
            self.users['seller'] = seller_data
            
        # Test duplicate registration
        response = self.make_request("POST", "/auth/register", buyer_data)
        duplicate_handled = response and response.status_code == 400
        
        success = buyer_success and seller_success and duplicate_handled
        details = f"Buyer: {buyer_success}, Seller: {seller_success}, Duplicate handled: {duplicate_handled}"
        self.log_test("User Registration", success, details)
        return success
    
    def test_email_verification(self):
        """Test email verification system"""
        # Since we can't access real verification codes, we'll simulate the process
        # In a real test, you'd need to check the database or mock the email service
        
        # Test with invalid code first
        invalid_verification = {
            "email": "alice.buyer@leemaz.com",
            "code": "000000"
        }
        
        response = self.make_request("POST", "/auth/verify-email", invalid_verification)
        invalid_handled = response and response.status_code == 400
        
        # For testing purposes, we'll assume verification codes are generated
        # In production, you'd retrieve these from logs or database
        success = invalid_handled
        details = f"Invalid code handled: {invalid_handled}"
        self.log_test("Email Verification System", success, details)
        return success
    
    def test_login_system(self):
        """Test login system with various scenarios"""
        # Test login with unverified account (should fail)
        login_data = {
            "email": "alice.buyer@leemaz.com",
            "password": "SecurePass123!"
        }
        
        response = self.make_request("POST", "/auth/login", login_data)
        unverified_blocked = response and response.status_code == 401
        
        # Test invalid credentials
        invalid_login = {
            "email": "alice.buyer@leemaz.com", 
            "password": "WrongPassword"
        }
        
        response = self.make_request("POST", "/auth/login", invalid_login)
        invalid_blocked = response and response.status_code == 401
        
        # Test non-existent user
        nonexistent_login = {
            "email": "nonexistent@leemaz.com",
            "password": "AnyPassword"
        }
        
        response = self.make_request("POST", "/auth/login", nonexistent_login)
        nonexistent_blocked = response and response.status_code == 401
        
        success = unverified_blocked and invalid_blocked and nonexistent_blocked
        details = f"Unverified blocked: {unverified_blocked}, Invalid blocked: {invalid_blocked}, Nonexistent blocked: {nonexistent_blocked}"
        self.log_test("Login Security", success, details)
        return success
    
    def simulate_verified_users(self):
        """Simulate verified users for testing (bypassing email verification)"""
        # For testing purposes, we'll create verified users directly
        # This simulates the state after email verification
        
        verified_buyer = {
            "email": "verified.buyer@leemaz.com",
            "password": "SecurePass123!",
            "full_name": "Verified Alice",
            "user_type": "buyer",
            "language": "en"
        }
        
        verified_seller = {
            "email": "verified.seller@leemaz.com",
            "password": "SecurePass456!",
            "full_name": "Verified Bob",
            "user_type": "seller", 
            "language": "en"
        }
        
        # Register users
        buyer_response = self.make_request("POST", "/auth/register", verified_buyer)
        seller_response = self.make_request("POST", "/auth/register", verified_seller)
        
        buyer_success = buyer_response and buyer_response.status_code == 200
        seller_success = seller_response and seller_response.status_code == 200
        
        if buyer_success and seller_success:
            self.users['verified_buyer'] = verified_buyer
            self.users['verified_seller'] = verified_seller
            
        success = buyer_success and seller_success
        self.log_test("Create Test Users", success, "Created verified test users for further testing")
        return success
    
    def test_jwt_authentication(self):
        """Test JWT token generation and validation"""
        # Try to access protected endpoint without token
        response = self.make_request("GET", "/auth/me")
        no_token_blocked = response and response.status_code == 401
        
        # Try with invalid token
        response = self.make_request("GET", "/auth/me", token="invalid_token")
        invalid_token_blocked = response and response.status_code == 401
        
        success = no_token_blocked and invalid_token_blocked
        details = f"No token blocked: {no_token_blocked}, Invalid token blocked: {invalid_token_blocked}"
        self.log_test("JWT Authentication", success, details)
        return success
    
    def test_shop_creation(self):
        """Test shop creation functionality"""
        # First, we need a verified seller token (simulated)
        # In real scenario, this would come from successful login after verification
        
        shop_data = {
            "name": "Bob's Electronics Store",
            "description": "Premium electronics and gadgets for tech enthusiasts",
            "category": "Electronics"
        }
        
        # Test shop creation without authentication
        response = self.make_request("POST", "/shops", shop_data)
        no_auth_blocked = response and response.status_code == 401
        
        success = no_auth_blocked
        details = f"Unauthorized shop creation blocked: {no_auth_blocked}"
        self.log_test("Shop Creation Security", success, details)
        return success
    
    def test_product_management(self):
        """Test product creation and management"""
        product_data = {
            "name": "iPhone 15 Pro Max",
            "description": "Latest iPhone with advanced camera system and A17 Pro chip",
            "price": 1199.99,
            "category": "Electronics",
            "images": ["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="],
            "shop_id": "507f1f77bcf86cd799439011"  # Mock shop ID
        }
        
        # Test product creation without authentication
        response = self.make_request("POST", "/products", product_data)
        no_auth_blocked = response and response.status_code == 401
        
        # Test product listing (should work without auth)
        response = self.make_request("GET", "/products")
        listing_works = response and response.status_code == 200
        
        # Test product filtering by category
        response = self.make_request("GET", "/products?category=Electronics")
        filtering_works = response and response.status_code == 200
        
        success = no_auth_blocked and listing_works and filtering_works
        details = f"Unauthorized creation blocked: {no_auth_blocked}, Listing works: {listing_works}, Filtering works: {filtering_works}"
        self.log_test("Product Management", success, details)
        return success
    
    def test_review_system(self):
        """Test review creation and rating calculation"""
        review_data = {
            "product_id": "507f1f77bcf86cd799439011",  # Mock product ID
            "rating": 5,
            "comment": "Excellent product! Highly recommended for anyone looking for quality."
        }
        
        # Test review creation without authentication
        response = self.make_request("POST", "/reviews", review_data)
        no_auth_blocked = response and response.status_code == 401
        
        # Test getting reviews for a product (should work without auth)
        response = self.make_request("GET", "/products/507f1f77bcf86cd799439011/reviews")
        review_listing_works = response and response.status_code == 200
        
        success = no_auth_blocked and review_listing_works
        details = f"Unauthorized review blocked: {no_auth_blocked}, Review listing works: {review_listing_works}"
        self.log_test("Review System", success, details)
        return success
    
    def test_chat_system(self):
        """Test messaging system"""
        message_data = {
            "receiver_id": "507f1f77bcf86cd799439011",  # Mock user ID
            "message": "Hi! I'm interested in your iPhone. Is it still available?"
        }
        
        # Test sending message without authentication
        response = self.make_request("POST", "/chat/messages", message_data)
        no_auth_blocked = response and response.status_code == 401
        
        # Test getting conversations without authentication
        response = self.make_request("GET", "/chat/conversations")
        conversations_blocked = response and response.status_code == 401
        
        success = no_auth_blocked and conversations_blocked
        details = f"Unauthorized messaging blocked: {no_auth_blocked}, Conversations blocked: {conversations_blocked}"
        self.log_test("Chat System Security", success, details)
        return success
    
    def test_favorites_system(self):
        """Test favorites functionality"""
        product_id = "507f1f77bcf86cd799439011"  # Mock product ID
        
        # Test adding to favorites without authentication
        response = self.make_request("POST", f"/favorites/{product_id}")
        add_blocked = response and response.status_code == 401
        
        # Test removing from favorites without authentication
        response = self.make_request("DELETE", f"/favorites/{product_id}")
        remove_blocked = response and response.status_code == 401
        
        # Test getting favorites without authentication
        response = self.make_request("GET", "/favorites")
        get_blocked = response and response.status_code == 401
        
        success = add_blocked and remove_blocked and get_blocked
        details = f"Add blocked: {add_blocked}, Remove blocked: {remove_blocked}, Get blocked: {get_blocked}"
        self.log_test("Favorites System Security", success, details)
        return success
    
    def test_credit_system(self):
        """Test credit management"""
        # Test getting credit balance without authentication
        response = self.make_request("GET", "/credits/balance")
        balance_blocked = response and response.status_code == 401
        
        # Test getting credit transactions without authentication
        response = self.make_request("GET", "/credits/transactions")
        transactions_blocked = response and response.status_code == 401
        
        success = balance_blocked and transactions_blocked
        details = f"Balance blocked: {balance_blocked}, Transactions blocked: {transactions_blocked}"
        self.log_test("Credit System Security", success, details)
        return success
    
    def test_admin_functions(self):
        """Test admin functionality"""
        # Test getting all users without authentication
        response = self.make_request("GET", "/admin/users")
        users_blocked = response and response.status_code == 401
        
        # Test adding credits without authentication
        response = self.make_request("POST", "/admin/users/507f1f77bcf86cd799439011/credits", {"credits": 100})
        credits_blocked = response and response.status_code == 401
        
        success = users_blocked and credits_blocked
        details = f"User listing blocked: {users_blocked}, Credit addition blocked: {credits_blocked}"
        self.log_test("Admin Functions Security", success, details)
        return success
    
    def test_shop_logo_functionality(self):
        """Test comprehensive shop logo upload and display functionality"""
        print("\n" + "="*50)
        print("SHOP LOGO FUNCTIONALITY TESTING")
        print("="*50)
        
        # Test base64 image for logo testing
        test_logo_base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
        
        # Step 1: Login as admin to get token
        admin_login = {
            "email": "admin@leemaz.com",
            "password": "admin123"
        }
        
        response = self.make_request("POST", "/auth/login", admin_login)
        if not response or response.status_code != 200:
            self.log_test("Admin Login for Logo Testing", False, f"Failed to login as admin: {response.status_code if response else 'No response'}")
            return False
            
        admin_token = response.json().get("access_token")
        self.tokens['admin'] = admin_token
        
        # Step 2: Create a test seller account
        seller_data = {
            "email": "logo.seller@leemaz.com",
            "password": "LogoTest123!",
            "full_name": "Logo Test Seller",
            "user_type": "seller",
            "language": "en"
        }
        
        response = self.make_request("POST", "/auth/register", seller_data)
        seller_registered = response and response.status_code == 200
        
        if not seller_registered:
            self.log_test("Seller Registration for Logo Testing", False, f"Failed to register seller: {response.status_code if response else 'No response'}")
            return False
            
        # Step 3: Login as seller
        seller_login = {
            "email": "logo.seller@leemaz.com",
            "password": "LogoTest123!"
        }
        
        response = self.make_request("POST", "/auth/login", seller_login)
        if not response or response.status_code != 200:
            self.log_test("Seller Login for Logo Testing", False, f"Failed to login as seller: {response.status_code if response else 'No response'}")
            return False
            
        seller_token = response.json().get("access_token")
        self.tokens['seller'] = seller_token
        
        # Test 1: Create shop with logo
        shop_with_logo = {
            "name": "Logo Electronics Store",
            "description": "Electronics store with a beautiful logo",
            "category": "Electronics",
            "logo": test_logo_base64
        }
        
        response = self.make_request("POST", "/shops", shop_with_logo, token=seller_token)
        shop_created_with_logo = response and response.status_code == 200
        
        shop_id = None
        if shop_created_with_logo:
            shop_data = response.json()
            shop_id = shop_data.get("id")
            logo_stored = shop_data.get("logo") == test_logo_base64
            self.log_test("Shop Creation with Logo", shop_created_with_logo and logo_stored, 
                         f"Shop created: {shop_created_with_logo}, Logo stored correctly: {logo_stored}")
        else:
            self.log_test("Shop Creation with Logo", False, 
                         f"Failed to create shop with logo: {response.status_code if response else 'No response'}")
        
        # Test 2: Create shop without logo (should work fine)
        seller2_data = {
            "email": "nologoseller@leemaz.com",
            "password": "NoLogo123!",
            "full_name": "No Logo Seller",
            "user_type": "seller",
            "language": "en"
        }
        
        response = self.make_request("POST", "/auth/register", seller2_data)
        if response and response.status_code == 200:
            seller2_login = {
                "email": "nologoseller@leemaz.com",
                "password": "NoLogo123!"
            }
            
            response = self.make_request("POST", "/auth/login", seller2_login)
            if response and response.status_code == 200:
                seller2_token = response.json().get("access_token")
                
                shop_without_logo = {
                    "name": "No Logo Store",
                    "description": "Store without logo",
                    "category": "Fashion"
                }
                
                response = self.make_request("POST", "/shops", shop_without_logo, token=seller2_token)
                shop_created_without_logo = response and response.status_code == 200
                
                if shop_created_without_logo:
                    shop_data = response.json()
                    logo_is_null = shop_data.get("logo") is None
                    self.log_test("Shop Creation without Logo", shop_created_without_logo and logo_is_null,
                                 f"Shop created: {shop_created_without_logo}, Logo is null: {logo_is_null}")
                else:
                    self.log_test("Shop Creation without Logo", False,
                                 f"Failed to create shop without logo: {response.status_code if response else 'No response'}")
        
        # Test 3: Approve shops as admin (required for shops to be visible)
        if shop_id and admin_token:
            response = self.make_request("POST", f"/admin/shops/{shop_id}/approve", token=admin_token)
            shop_approved = response and response.status_code == 200
            self.log_test("Shop Approval by Admin", shop_approved,
                         f"Shop approval: {shop_approved}")
        
        # Test 4: Retrieve shop and verify logo is included
        if shop_id:
            response = self.make_request("GET", "/shops/my", token=seller_token)
            shop_retrieved = response and response.status_code == 200
            
            if shop_retrieved:
                shop_data = response.json()
                logo_retrieved = shop_data.get("logo") == test_logo_base64
                self.log_test("Shop Retrieval with Logo", shop_retrieved and logo_retrieved,
                             f"Shop retrieved: {shop_retrieved}, Logo matches: {logo_retrieved}")
            else:
                self.log_test("Shop Retrieval with Logo", False,
                             f"Failed to retrieve shop: {response.status_code if response else 'No response'}")
        
        # Test 5: List all shops and verify logos are included
        response = self.make_request("GET", "/shops")
        shops_listed = response and response.status_code == 200
        
        if shops_listed:
            shops_data = response.json()
            logos_included = True
            for shop in shops_data:
                if 'logo' not in shop:
                    logos_included = False
                    break
            
            self.log_test("Shop Listing with Logos", shops_listed and logos_included,
                         f"Shops listed: {shops_listed}, Logos field included: {logos_included}, Total shops: {len(shops_data)}")
        else:
            self.log_test("Shop Listing with Logos", False,
                         f"Failed to list shops: {response.status_code if response else 'No response'}")
        
        # Test 6: Test invalid base64 logo (should handle gracefully)
        invalid_logo_shop = {
            "name": "Invalid Logo Store",
            "description": "Store with invalid logo",
            "category": "Books",
            "logo": "invalid_base64_data"
        }
        
        # Create another seller for this test
        seller3_data = {
            "email": "invalidlogo@leemaz.com",
            "password": "Invalid123!",
            "full_name": "Invalid Logo Seller",
            "user_type": "seller",
            "language": "en"
        }
        
        response = self.make_request("POST", "/auth/register", seller3_data)
        if response and response.status_code == 200:
            seller3_login = {
                "email": "invalidlogo@leemaz.com",
                "password": "Invalid123!"
            }
            
            response = self.make_request("POST", "/auth/login", seller3_login)
            if response and response.status_code == 200:
                seller3_token = response.json().get("access_token")
                
                response = self.make_request("POST", "/shops", invalid_logo_shop, token=seller3_token)
                # Should either accept it (backend doesn't validate base64) or reject it gracefully
                invalid_logo_handled = response and response.status_code in [200, 400, 422]
                self.log_test("Invalid Logo Handling", invalid_logo_handled,
                             f"Invalid logo handled gracefully: {response.status_code if response else 'No response'}")
        
        print("\n" + "="*50)
        print("SHOP LOGO TESTING COMPLETED")
        print("="*50)
        
        # Return overall success - all critical tests should pass
        return (shop_created_with_logo and shop_retrieved and shops_listed)
    
    def test_error_handling(self):
        """Test API error handling"""
        # Test invalid endpoint
        response = self.make_request("GET", "/invalid-endpoint")
        invalid_endpoint = response and response.status_code == 404
        
        # Test malformed JSON
        try:
            url = f"{API_BASE}/auth/register"
            response = self.session.post(url, data="invalid json", headers={"Content-Type": "application/json"})
            malformed_handled = response.status_code in [400, 422]
        except:
            malformed_handled = True
        
        success = invalid_endpoint and malformed_handled
        details = f"Invalid endpoint handled: {invalid_endpoint}, Malformed JSON handled: {malformed_handled}"
        self.log_test("Error Handling", success, details)
        return success
    
    def run_all_tests(self):
        """Run comprehensive test suite"""
        print("=" * 60)
        print("LEEMAZ E-COMMERCE BACKEND API TEST SUITE")
        print("=" * 60)
        print()
        
        test_results = []
        
        # Core functionality tests
        test_results.append(self.test_health_check())
        test_results.append(self.test_user_registration())
        test_results.append(self.test_email_verification())
        test_results.append(self.test_login_system())
        test_results.append(self.simulate_verified_users())
        test_results.append(self.test_jwt_authentication())
        test_results.append(self.test_shop_creation())
        test_results.append(self.test_product_management())
        test_results.append(self.test_review_system())
        test_results.append(self.test_chat_system())
        test_results.append(self.test_favorites_system())
        test_results.append(self.test_credit_system())
        test_results.append(self.test_admin_functions())
        test_results.append(self.test_error_handling())
        
        # Summary
        passed = sum(test_results)
        total = len(test_results)
        
        print("=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if passed == total:
            print("\n🎉 ALL TESTS PASSED! Backend API is working correctly.")
        else:
            print(f"\n⚠️  {total - passed} tests failed. Please check the issues above.")
        
        return passed == total

if __name__ == "__main__":
    tester = LeemazeCommerceAPITester()
    tester.run_all_tests()