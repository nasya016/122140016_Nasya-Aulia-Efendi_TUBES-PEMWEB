#!/usr/bin/env python
"""
Simple API test script
"""
import requests
import json

BASE_URL = "http://localhost:6543"

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        print(f"Health check: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health check failed: {e}")
        return False

def test_cors():
    """Test CORS preflight"""
    try:
        headers = {
            'Origin': 'http://localhost:3000',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type, Authorization'
        }
        response = requests.options(f"{BASE_URL}/api/auth/register", headers=headers)
        print(f"CORS preflight: {response.status_code}")
        print(f"CORS headers: {dict(response.headers)}")
        return response.status_code == 200
    except Exception as e:
        print(f"CORS test failed: {e}")
        return False

def test_register():
    """Test user registration"""
    try:
        data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "password123"
        }
        response = requests.post(f"{BASE_URL}/api/auth/register", json=data)
        print(f"Register: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
            return True
        else:
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"Register test failed: {e}")
        return False

def main():
    """Run API tests"""
    print("🧪 Testing TugasKu API...\n")
    
    tests = [
        ("Health Check", test_health),
        ("CORS Preflight", test_cors),
        ("User Registration", test_register)
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"Running {test_name}...")
        result = test_func()
        results.append((test_name, result))
        print(f"✅ {test_name}: {'PASSED' if result else 'FAILED'}\n")
    
    # Summary
    passed = sum(1 for _, result in results if result)
    total = len(results)
    print(f"📊 Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed!")
    else:
        print("❌ Some tests failed!")

if __name__ == '__main__':
    main()
