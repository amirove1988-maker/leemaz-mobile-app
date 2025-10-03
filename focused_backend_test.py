#!/usr/bin/env python3
"""
Focused Backend API Testing for Authentication Issues
Tests specific authentication endpoints and error scenarios
"""

import requests
import json
import uuid
from datetime import datetime

# Configuration
BASE_URL = "https://leemaz-subs.preview.emergentagent.com/api"
TIMEOUT = 10

class FocusedBackendTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session = requests.Session()
        self.session.timeout = TIMEOUT
        self.test_results = []
        
    def log_result(self, test_name, success, message, details=None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "details": details or {}
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def test_health_check(self):
        """Test basic health endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/health")
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_result("Health Check", True, "Backend is responding and healthy")
                    return True
                else:
                    self.log_result("Health Check", False, f"Unexpected health response: {data}")
                    return False
            else:
                self.log_result("Health Check", False, f"Health endpoint returned {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_result("Health Check", False, f"Failed to connect to backend: {str(e)}")
            return False
    
    def test_registration_detailed(self):
        """Test user registration with detailed error analysis"""
        try:
            # Generate unique test user
            unique_id = str(uuid.uuid4())[:8]
            test_email = f"testuser_{unique_id}@leemaz.com"
            
            user_data = {
                "email": test_email,
                "password": "TestPass123!",
                "full_name": f"Test User {unique_id}",
                "user_type": "buyer",
                "language": "en"
            }
            
            response = self.session.post(f"{self.base_url}/auth/register", json=user_data)
            
            print(f"Registration Response Status: {response.status_code}")
            print(f"Registration Response Headers: {dict(response.headers)}")
            print(f"Registration Response Body: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                self.log_result("User Registration Detailed", True, f"Registration successful: {test_email}")
                return True, test_email, "TestPass123!"
            elif response.status_code == 422:
                try:
                    error_data = response.json()
                    self.log_result("User Registration Detailed", False, f"Validation error: {error_data}")
                except:
                    self.log_result("User Registration Detailed", False, f"422 error with non-JSON response: {response.text}")
                return False, None, None
            else:
                self.log_result("User Registration Detailed", False, f"Registration failed with status {response.status_code}: {response.text}")
                return False, None, None
                
        except Exception as e:
            self.log_result("User Registration Detailed", False, f"Registration request failed: {str(e)}")
            return False, None, None
    
    def test_login_detailed(self, email, password):
        """Test user login with detailed error analysis"""
        try:
            if not email or not password:
                self.log_result("User Login Detailed", False, "No credentials available for login test")
                return False, None
            
            login_data = {
                "email": email,
                "password": password
            }
            
            response = self.session.post(f"{self.base_url}/auth/login", json=login_data)
            
            print(f"Login Response Status: {response.status_code}")
            print(f"Login Response Headers: {dict(response.headers)}")
            print(f"Login Response Body: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "token_type" in data:
                    self.log_result("User Login Detailed", True, f"Login successful, token received")
                    return True, data["access_token"]
                else:
                    self.log_result("User Login Detailed", False, f"Login response missing token: {data}")
                    return False, None
            else:
                self.log_result("User Login Detailed", False, f"Login failed with status {response.status_code}: {response.text}")
                return False, None
                
        except Exception as e:
            self.log_result("User Login Detailed", False, f"Login request failed: {str(e)}")
            return False, None
    
    def test_auth_me_detailed(self, token):
        """Test /auth/me endpoint with detailed error analysis"""
        try:
            if not token:
                self.log_result("Auth Me Detailed", False, "No token available for auth/me test")
                return False
            
            headers = {"Authorization": f"Bearer {token}"}
            response = self.session.get(f"{self.base_url}/auth/me", headers=headers)
            
            print(f"Auth/Me Response Status: {response.status_code}")
            print(f"Auth/Me Response Headers: {dict(response.headers)}")
            print(f"Auth/Me Response Body: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                if "email" in data and "full_name" in data:
                    self.log_result("Auth Me Detailed", True, f"User info retrieved: {data['email']}")
                    return True
                else:
                    self.log_result("Auth Me Detailed", False, f"User info response missing fields: {data}")
                    return False
            elif response.status_code == 401:
                self.log_result("Auth Me Detailed", False, f"Token validation failed: {response.text}")
                return False
            elif response.status_code == 403:
                self.log_result("Auth Me Detailed", False, f"Access forbidden: {response.text}")
                return False
            else:
                self.log_result("Auth Me Detailed", False, f"Unexpected status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("Auth Me Detailed", False, f"Auth/me request failed: {str(e)}")
            return False
    
    def test_existing_user_login(self):
        """Test login with existing users from previous tests"""
        existing_users = [
            {"email": "alice.buyer@leemaz.com", "password": "SecurePass123!"},
            {"email": "bob.seller@leemaz.com", "password": "SecurePass456!"},
            {"email": "verified.buyer@leemaz.com", "password": "SecurePass123!"},
            {"email": "verified.seller@leemaz.com", "password": "SecurePass456!"},
            {"email": "comprehensive.buyer@leemaz.com", "password": "SecurePass123!"},
            {"email": "comprehensive.seller@leemaz.com", "password": "SecurePass456!"}
        ]
        
        successful_logins = 0
        for user in existing_users:
            try:
                response = self.session.post(f"{self.base_url}/auth/login", json=user)
                if response.status_code == 200:
                    data = response.json()
                    if "access_token" in data:
                        successful_logins += 1
                        print(f"✅ Existing user login successful: {user['email']}")
                        
                        # Test the token
                        headers = {"Authorization": f"Bearer {data['access_token']}"}
                        me_response = self.session.get(f"{self.base_url}/auth/me", headers=headers)
                        if me_response.status_code == 200:
                            user_info = me_response.json()
                            print(f"   User info: {user_info.get('full_name', 'N/A')}, Credits: {user_info.get('credits', 'N/A')}")
                        else:
                            print(f"   Token validation failed: {me_response.status_code}")
                else:
                    print(f"❌ Existing user login failed: {user['email']} - {response.status_code}")
            except Exception as e:
                print(f"❌ Error testing existing user {user['email']}: {str(e)}")
        
        success = successful_logins > 0
        self.log_result("Existing User Login Test", success, f"{successful_logins}/{len(existing_users)} existing users can login")
        return success, successful_logins
    
    def test_admin_login(self):
        """Test admin login specifically"""
        try:
            admin_data = {
                "email": "admin@leemaz.com",
                "password": "admin123"
            }
            
            response = self.session.post(f"{self.base_url}/auth/login", json=admin_data)
            
            print(f"Admin Login Response Status: {response.status_code}")
            print(f"Admin Login Response Body: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data:
                    admin_token = data["access_token"]
                    
                    # Test admin access
                    headers = {"Authorization": f"Bearer {admin_token}"}
                    dashboard_response = self.session.get(f"{self.base_url}/admin/dashboard", headers=headers)
                    
                    print(f"Admin Dashboard Response Status: {dashboard_response.status_code}")
                    print(f"Admin Dashboard Response Body: {dashboard_response.text}")
                    
                    if dashboard_response.status_code == 200:
                        self.log_result("Admin Login Test", True, "Admin login and dashboard access successful")
                        return True, admin_token
                    else:
                        self.log_result("Admin Login Test", False, f"Admin dashboard access failed: {dashboard_response.status_code}")
                        return False, admin_token
                else:
                    self.log_result("Admin Login Test", False, f"Admin login response missing token: {data}")
                    return False, None
            else:
                self.log_result("Admin Login Test", False, f"Admin login failed: {response.status_code} - {response.text}")
                return False, None
                
        except Exception as e:
            self.log_result("Admin Login Test", False, f"Admin login request failed: {str(e)}")
            return False, None
    
    def run_focused_tests(self):
        """Run focused authentication tests"""
        print("🔍 Starting Focused Backend Authentication Testing")
        print(f"📍 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test 1: Health check
        health_ok = self.test_health_check()
        
        if not health_ok:
            print("\n❌ CRITICAL: Backend health check failed. Stopping tests.")
            return self.generate_summary()
        
        # Test 2: Detailed registration
        reg_success, test_email, test_password = self.test_registration_detailed()
        
        # Test 3: Detailed login (with new user if registration worked)
        if reg_success:
            login_success, token = self.test_login_detailed(test_email, test_password)
            
            # Test 4: Detailed auth/me
            if login_success:
                self.test_auth_me_detailed(token)
        
        # Test 5: Existing user login
        self.test_existing_user_login()
        
        # Test 6: Admin login
        self.test_admin_login()
        
        return self.generate_summary()
    
    def generate_summary(self):
        """Generate test summary"""
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print("\n" + "=" * 60)
        print("📊 FOCUSED TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests*100):.1f}%" if total_tests > 0 else "0%")
        
        if failed_tests > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  • {result['test']}: {result['message']}")
        
        print("\n" + "=" * 60)
        
        return {
            "total": total_tests,
            "passed": passed_tests,
            "failed": failed_tests,
            "success_rate": (passed_tests/total_tests*100) if total_tests > 0 else 0,
            "results": self.test_results
        }

def main():
    """Main test execution"""
    tester = FocusedBackendTester()
    summary = tester.run_focused_tests()
    
    # Return exit code based on results
    if summary["failed"] > 0:
        exit(1)
    else:
        exit(0)

if __name__ == "__main__":
    main()