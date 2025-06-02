#!/usr/bin/env python
"""
Simple login test script
"""
import requests
import json

BASE_URL = "http://localhost:6543"

def test_login(username, password):
    """Test login with given credentials"""
    print(f"Testing login for user: {username}")
    
    data = {
        "username": username,
        "password": password
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", json=data)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Login successful!")
            print(f"User: {result['user']['username']}")
            print(f"Email: {result['user']['email']}")
            print(f"Token: {result['token'][:50]}...")
            return result['token']
        else:
            print("❌ Login failed!")
            print(f"Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Request failed: {e}")
        return None

def test_profile(token):
    """Test profile endpoint with token"""
    print("\nTesting profile endpoint...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/api/auth/profile", headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Profile retrieved successfully!")
            print(json.dumps(result, indent=2))
        else:
            print("❌ Profile request failed!")
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Request failed: {e}")

def main():
    """Test login functionality"""
    print("=== TugasKu Login Test ===\n")
    
    # Test admin login
    print("1. Testing admin login:")
    token = test_login("admin", "admin123")
    if token:
        test_profile(token)
    
    print("\n" + "="*50 + "\n")
    
    # Test regular user login
    print("2. Testing test user login:")
    token = test_login("testuser", "password123")
    if token:
        test_profile(token)
    
    print("\n" + "="*50 + "\n")
    
    # Test invalid login
    print("3. Testing invalid login:")
    test_login("invalid", "wrongpassword")

if __name__ == "__main__":
    main()
