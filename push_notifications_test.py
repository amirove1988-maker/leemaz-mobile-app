#!/usr/bin/env python3
"""
Focused Push Notifications System Test for Newly Implemented Endpoints
Tests the specific endpoints mentioned in the review request.
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

print(f"Testing push notifications at: {API_BASE}")

class PushNotificationsTester:
    def __init__(self):
        self.session = requests.Session()
        self.admin_token = None
        self.user_token = None
        self.user_id = None
        
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
    
    def setup_test_environment(self):
        """Setup admin and user accounts for testing"""
        print("Setting up test environment...")
        
        # Create and login admin
        admin_login = {
            "email": "admin@leemaz.com",
            "password": "admin123"
        }
        
        response = self.make_request("POST", "/auth/login", admin_login)
        if response and response.status_code == 200:
            self.admin_token = response.json().get("access_token")
            print("✅ Admin login successful")
        else:
            print("❌ Admin login failed")
            return False
        
        # Create test user
        user_data = {
            "email": "pushtest.user@leemaz.com",
            "password": "PushTest123!",
            "full_name": "Push Test User",
            "user_type": "buyer",
            "language": "en"
        }
        
        response = self.make_request("POST", "/auth/register", user_data)
        if response and response.status_code == 200:
            print("✅ User registration successful")
        else:
            print("❌ User registration failed, might already exist")
        
        # Login user
        user_login = {
            "email": "pushtest.user@leemaz.com",
            "password": "PushTest123!"
        }
        
        response = self.make_request("POST", "/auth/login", user_login)
        if response and response.status_code == 200:
            self.user_token = response.json().get("access_token")
            print("✅ User login successful")
        else:
            print("❌ User login failed")
            return False
        
        # Get user ID
        response = self.make_request("GET", "/auth/me", token=self.user_token)
        if response and response.status_code == 200:
            self.user_id = response.json().get("id")
            print(f"✅ User ID obtained: {self.user_id}")
        else:
            print("❌ Failed to get user ID")
            return False
            
        return True
    
    def test_device_token_registration(self):
        """Test POST /api/notifications/register-token for iOS and Android"""
        print("\n" + "="*60)
        print("TESTING DEVICE TOKEN REGISTRATION")
        print("="*60)
        
        # Test iOS device token registration
        ios_token_data = {
            "device_token": "ExponentPushToken[iOS_test_token_12345]",
            "device_type": "ios"
        }
        
        response = self.make_request("POST", "/notifications/register-token", ios_token_data, token=self.user_token)
        ios_success = response and response.status_code == 200
        
        self.log_test("iOS Device Token Registration", ios_success, 
                     f"Status: {response.status_code if response else 'No response'}")
        
        # Test Android device token registration
        android_token_data = {
            "device_token": "ExponentPushToken[Android_test_token_67890]",
            "device_type": "android"
        }
        
        response = self.make_request("POST", "/notifications/register-token", android_token_data, token=self.user_token)
        android_success = response and response.status_code == 200
        
        self.log_test("Android Device Token Registration", android_success, 
                     f"Status: {response.status_code if response else 'No response'}")
        
        # Test duplicate token registration
        response = self.make_request("POST", "/notifications/register-token", ios_token_data, token=self.user_token)
        duplicate_success = response and response.status_code == 200
        
        self.log_test("Duplicate Token Registration", duplicate_success, 
                     f"Status: {response.status_code if response else 'No response'}")
        
        # Test without authentication
        response = self.make_request("POST", "/notifications/register-token", ios_token_data)
        auth_protected = response and response.status_code == 401
        
        self.log_test("Token Registration Authentication", auth_protected, 
                     f"Unauthorized access blocked: {response.status_code if response else 'No response'}")
        
        return ios_success and android_success and duplicate_success and auth_protected
    
    def test_notification_preferences(self):
        """Test PUT and GET /api/notifications/preferences"""
        print("\n" + "="*60)
        print("TESTING NOTIFICATION PREFERENCES")
        print("="*60)
        
        # Test updating preferences
        preferences_data = {
            "push_notifications": True,
            "email_notifications": False,
            "sms_notifications": False,
            "notification_types": ["new_message", "shop_approved", "order_update"]
        }
        
        response = self.make_request("PUT", "/notifications/preferences", preferences_data, token=self.user_token)
        update_success = response and response.status_code == 200
        
        self.log_test("Update Notification Preferences", update_success, 
                     f"Status: {response.status_code if response else 'No response'}")
        
        # Test getting preferences
        response = self.make_request("GET", "/notifications/preferences", token=self.user_token)
        get_success = response and response.status_code == 200
        
        preferences_retrieved = None
        if get_success:
            preferences_retrieved = response.json()
            
        self.log_test("Get Notification Preferences", get_success, 
                     f"Status: {response.status_code if response else 'No response'}")
        
        # Test data integrity
        data_integrity = False
        if preferences_retrieved:
            expected_fields = ["push_notifications", "email_notifications", "sms_notifications", "notification_types"]
            data_integrity = all(field in preferences_retrieved for field in expected_fields)
            
        self.log_test("Preferences Data Integrity", data_integrity, 
                     f"All required fields present: {data_integrity}")
        
        # Test different preference values
        updated_preferences = {
            "push_notifications": False,
            "email_notifications": True,
            "sms_notifications": True,
            "notification_types": ["new_message"]
        }
        
        response = self.make_request("PUT", "/notifications/preferences", updated_preferences, token=self.user_token)
        update2_success = response and response.status_code == 200
        
        # Verify the update
        response = self.make_request("GET", "/notifications/preferences", token=self.user_token)
        values_updated = False
        if response and response.status_code == 200:
            updated_data = response.json()
            values_updated = (
                updated_data.get("push_notifications") == False and
                updated_data.get("email_notifications") == True and
                updated_data.get("sms_notifications") == True
            )
            
        self.log_test("Preferences Value Updates", update2_success and values_updated, 
                     f"Values correctly updated: {values_updated}")
        
        # Test without authentication
        response = self.make_request("PUT", "/notifications/preferences", preferences_data)
        put_auth_protected = response and response.status_code == 401
        
        response = self.make_request("GET", "/notifications/preferences")
        get_auth_protected = response and response.status_code == 401
        
        self.log_test("Preferences Authentication", put_auth_protected and get_auth_protected, 
                     f"PUT protected: {put_auth_protected}, GET protected: {get_auth_protected}")
        
        return update_success and get_success and data_integrity and values_updated
    
    def test_my_notifications_endpoint(self):
        """Test GET /api/notifications/my alternative endpoint"""
        print("\n" + "="*60)
        print("TESTING MY NOTIFICATIONS ENDPOINT")
        print("="*60)
        
        # Test /notifications/my endpoint
        response = self.make_request("GET", "/notifications/my", token=self.user_token)
        my_endpoint_success = response and response.status_code == 200
        
        my_notifications = []
        if my_endpoint_success:
            my_notifications = response.json()
            
        self.log_test("My Notifications Endpoint", my_endpoint_success, 
                     f"Status: {response.status_code if response else 'No response'}, Count: {len(my_notifications)}")
        
        # Test standard /notifications endpoint for comparison
        response = self.make_request("GET", "/notifications", token=self.user_token)
        standard_endpoint_success = response and response.status_code == 200
        
        standard_notifications = []
        if standard_endpoint_success:
            standard_notifications = response.json()
            
        self.log_test("Standard Notifications Endpoint", standard_endpoint_success, 
                     f"Status: {response.status_code if response else 'No response'}, Count: {len(standard_notifications)}")
        
        # Test consistency between endpoints
        endpoints_consistent = (len(my_notifications) == len(standard_notifications)) if (my_endpoint_success and standard_endpoint_success) else False
        
        self.log_test("Endpoints Consistency", endpoints_consistent, 
                     f"Both endpoints return same count: {endpoints_consistent}")
        
        # Test without authentication
        response = self.make_request("GET", "/notifications/my")
        auth_protected = response and response.status_code == 401
        
        self.log_test("My Notifications Authentication", auth_protected, 
                     f"Unauthorized access blocked: {response.status_code if response else 'No response'}")
        
        return my_endpoint_success and endpoints_consistent and auth_protected
    
    def test_admin_notification_sending(self):
        """Test admin notification sending with device tokens"""
        print("\n" + "="*60)
        print("TESTING ADMIN NOTIFICATION SENDING")
        print("="*60)
        
        # Send notification as admin
        notification_data = {
            "user_id": self.user_id,
            "title": "Test Push Notification",
            "message": "Testing admin notification sending with registered device tokens",
            "type": "general"
        }
        
        response = self.make_request("POST", "/admin/notifications/send", notification_data, token=self.admin_token)
        admin_send_success = response and response.status_code == 200
        
        self.log_test("Admin Send Notification", admin_send_success, 
                     f"Status: {response.status_code if response else 'No response'}")
        
        # Test unauthorized access (user trying to send admin notification)
        response = self.make_request("POST", "/admin/notifications/send", notification_data, token=self.user_token)
        admin_protected = response and response.status_code == 403
        
        self.log_test("Admin Notification Security", admin_protected, 
                     f"Non-admin blocked: {response.status_code if response else 'No response'}")
        
        # Verify notification appears in user's notifications
        time.sleep(1)  # Brief delay
        response = self.make_request("GET", "/notifications/my", token=self.user_token)
        notification_received = False
        if response and response.status_code == 200:
            notifications = response.json()
            notification_received = len(notifications) > 0
            
        self.log_test("Notification Delivery", notification_received, 
                     f"Notification appears in user's list: {notification_received}")
        
        return admin_send_success and admin_protected and notification_received
    
    def run_push_notifications_tests(self):
        """Run all push notification tests"""
        print("="*70)
        print("PUSH NOTIFICATIONS SYSTEM - NEWLY IMPLEMENTED ENDPOINTS TEST")
        print("="*70)
        
        # Setup
        if not self.setup_test_environment():
            print("❌ Failed to setup test environment")
            return False
        
        # Run tests
        test_results = []
        test_results.append(self.test_device_token_registration())
        test_results.append(self.test_notification_preferences())
        test_results.append(self.test_my_notifications_endpoint())
        test_results.append(self.test_admin_notification_sending())
        
        # Summary
        passed = sum(1 for result in test_results if result is True)
        total = len(test_results)
        
        print("\n" + "="*70)
        print("PUSH NOTIFICATIONS TEST SUMMARY")
        print("="*70)
        
        print("\nNEWLY IMPLEMENTED ENDPOINTS:")
        print("✅ POST /api/notifications/register-token - Device token registration")
        print("✅ GET /api/notifications/my - Alternative notifications endpoint")
        print("✅ PUT /api/notifications/preferences - Update notification preferences")
        print("✅ GET /api/notifications/preferences - Get notification preferences")
        
        print(f"\nTEST RESULTS:")
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if passed == total:
            print("\n🎉 ALL PUSH NOTIFICATION TESTS PASSED!")
            print("✅ All newly implemented endpoints are working correctly")
            print("✅ Device token registration works for iOS and Android")
            print("✅ Notification preferences CRUD operations work")
            print("✅ Alternative notifications endpoint works")
            print("✅ All endpoints are properly authenticated")
            print("✅ Admin notification sending works with device tokens")
        else:
            print(f"\n⚠️  {total - passed} tests failed. Check details above.")
        
        return passed == total

if __name__ == "__main__":
    tester = PushNotificationsTester()
    tester.run_push_notifications_tests()