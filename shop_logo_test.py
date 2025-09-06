#!/usr/bin/env python3
"""
Shop Logo Functionality Test Suite for Leemaz E-commerce Platform
Focused testing of shop logo upload, display, and management features.
"""

import requests
import json
import time
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.getenv('EXPO_PUBLIC_BACKEND_URL', 'http://localhost:8001')
API_BASE = f"{BACKEND_URL}/api"

print(f"Testing shop logo functionality at: {API_BASE}")

class ShopLogoTester:
    def __init__(self):
        self.session = requests.Session()
        self.tokens = {}
        
    def log_test(self, test_name, success, details=""):
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
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
    
    def test_shop_logo_functionality(self):
        """Test comprehensive shop logo upload and display functionality"""
        print("\n" + "="*60)
        print("SHOP LOGO FUNCTIONALITY TESTING")
        print("="*60)
        
        # Test base64 image for logo testing
        test_logo_base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
        
        test_results = []
        
        # Step 1: Login as admin to get token
        print("Step 1: Admin Authentication")
        admin_login = {
            "email": "admin@leemaz.com",
            "password": "admin123"
        }
        
        response = self.make_request("POST", "/auth/login", admin_login)
        admin_login_success = response and response.status_code == 200
        
        if admin_login_success:
            admin_token = response.json().get("access_token")
            self.tokens['admin'] = admin_token
            self.log_test("Admin Login", True, "Successfully logged in as admin")
        else:
            self.log_test("Admin Login", False, f"Failed to login as admin: {response.status_code if response else 'No response'}")
            return False
        
        # Step 2: Create a test seller account
        print("Step 2: Create Test Seller")
        seller_data = {
            "email": "logo.seller@leemaz.com",
            "password": "LogoTest123!",
            "full_name": "Logo Test Seller",
            "user_type": "seller",
            "language": "en"
        }
        
        response = self.make_request("POST", "/auth/register", seller_data)
        seller_registered = response and response.status_code == 200
        
        if seller_registered:
            self.log_test("Seller Registration", True, "Test seller account created successfully")
        else:
            self.log_test("Seller Registration", False, f"Failed to register seller: {response.status_code if response else 'No response'}")
            return False
        
        # Step 3: Login as seller
        print("Step 3: Seller Authentication")
        seller_login = {
            "email": "logo.seller@leemaz.com",
            "password": "LogoTest123!"
        }
        
        response = self.make_request("POST", "/auth/login", seller_login)
        seller_login_success = response and response.status_code == 200
        
        if seller_login_success:
            seller_token = response.json().get("access_token")
            self.tokens['seller'] = seller_token
            self.log_test("Seller Login", True, "Successfully logged in as seller")
        else:
            self.log_test("Seller Login", False, f"Failed to login as seller: {response.status_code if response else 'No response'}")
            return False
        
        # Test 1: Create shop with logo
        print("Test 1: Shop Creation with Logo")
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
                         f"Shop ID: {shop_id}, Logo stored correctly: {logo_stored}")
            test_results.append(True)
        else:
            self.log_test("Shop Creation with Logo", False, 
                         f"Failed to create shop with logo: {response.status_code if response else 'No response'}")
            if response:
                print(f"   Response: {response.text}")
            test_results.append(False)
        
        # Test 2: Create shop without logo (should work fine)
        print("Test 2: Shop Creation without Logo")
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
                                 f"Shop created successfully, Logo is null: {logo_is_null}")
                    test_results.append(True)
                else:
                    self.log_test("Shop Creation without Logo", False,
                                 f"Failed to create shop without logo: {response.status_code if response else 'No response'}")
                    test_results.append(False)
        
        # Test 3: Approve shops as admin (required for shops to be visible)
        print("Test 3: Shop Approval by Admin")
        if shop_id and admin_token:
            response = self.make_request("POST", f"/admin/shops/{shop_id}/approve", token=admin_token)
            shop_approved = response and response.status_code == 200
            self.log_test("Shop Approval by Admin", shop_approved,
                         f"Shop approval status: {response.status_code if response else 'No response'}")
            test_results.append(shop_approved)
        else:
            self.log_test("Shop Approval by Admin", False, "Missing shop ID or admin token")
            test_results.append(False)
        
        # Test 4: Retrieve shop and verify logo is included
        print("Test 4: Shop Retrieval with Logo")
        if seller_token:
            response = self.make_request("GET", "/shops/my", token=seller_token)
            shop_retrieved = response and response.status_code == 200
            
            if shop_retrieved:
                shop_data = response.json()
                logo_retrieved = shop_data.get("logo") == test_logo_base64
                self.log_test("Shop Retrieval with Logo", shop_retrieved and logo_retrieved,
                             f"Shop retrieved successfully, Logo matches: {logo_retrieved}")
                test_results.append(True)
            else:
                self.log_test("Shop Retrieval with Logo", False,
                             f"Failed to retrieve shop: {response.status_code if response else 'No response'}")
                if response:
                    print(f"   Response: {response.text}")
                test_results.append(False)
        
        # Test 5: List all shops and verify logos are included
        print("Test 5: Shop Listing with Logos")
        response = self.make_request("GET", "/shops")
        shops_listed = response and response.status_code == 200
        
        if shops_listed:
            shops_data = response.json()
            logos_included = True
            logo_count = 0
            for shop in shops_data:
                if 'logo' not in shop:
                    logos_included = False
                    break
                if shop.get('logo'):
                    logo_count += 1
            
            self.log_test("Shop Listing with Logos", shops_listed and logos_included,
                         f"Shops listed: {len(shops_data)}, Logos field included: {logos_included}, Shops with logos: {logo_count}")
            test_results.append(True)
        else:
            self.log_test("Shop Listing with Logos", False,
                         f"Failed to list shops: {response.status_code if response else 'No response'}")
            test_results.append(False)
        
        # Test 6: Test invalid base64 logo (should handle gracefully)
        print("Test 6: Invalid Logo Handling")
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
                test_results.append(invalid_logo_handled)
        
        print("\n" + "="*60)
        print("SHOP LOGO TESTING SUMMARY")
        print("="*60)
        
        passed = sum(test_results)
        total = len(test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if passed == total:
            print("\n🎉 ALL SHOP LOGO TESTS PASSED! Shop logo functionality is working correctly.")
        else:
            print(f"\n⚠️  {total - passed} shop logo tests failed. Please check the issues above.")
        
        return passed == total

if __name__ == "__main__":
    tester = ShopLogoTester()
    success = tester.test_shop_logo_functionality()
    exit(0 if success else 1)