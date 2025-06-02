#!/usr/bin/env python
"""
Test the complete registration and dashboard access flow
"""
import requests
import json
import sys
import time
import random
import string

BASE_URL = "http://localhost:6543"

def generate_random_user():
    """Generate random user data"""
    random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
    return {
        "username": f"user_{random_suffix}",
        "email": f"user_{random_suffix}@example.com",
        "password": "password123"
    }

def test_registration_and_dashboard():
    """Test complete flow: register -> login -> dashboard"""
    print("=== Testing Registration and Dashboard Access Flow ===\n")
    
    # Generate random user data
    user_data = generate_random_user()
    print(f"Testing with user: {user_data['username']} ({user_data['email']})")
    
    # Step 1: Register new user
    print("\n1. Registering new user...")
    response = requests.post(f"{BASE_URL}/api/auth/register", json=user_data)
    print(f"Registration Status: {response.status_code}")
    
    if response.status_code != 200:
        print(f"Registration failed: {response.text}")
        return False
    
    registration_data = response.json()
    print("Registration successful!")
    print(f"User ID: {registration_data['user']['id']}")
    print(f"Username: {registration_data['user']['username']}")
    
    # Get token from registration
    token = registration_data.get('token')
    if not token:
        print("No token received from registration!")
        return False
    
    print(f"Token received: {token[:20]}...")
    
    # Step 2: Test profile access with registration token
    print("\n2. Testing profile access with registration token...")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/api/auth/profile", headers=headers)
    print(f"Profile Status: {response.status_code}")
    
    if response.status_code != 200:
        print(f"Profile access failed: {response.text}")
        return False
    
    profile_data = response.json()
    print("Profile access successful!")
    print(f"Profile User ID: {profile_data['user']['id']}")
    
    # Step 3: Test login with the same credentials
    print("\n3. Testing login with same credentials...")
    login_data = {
        "username": user_data["username"],
        "password": user_data["password"]
    }
    response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
    print(f"Login Status: {response.status_code}")
    
    if response.status_code != 200:
        print(f"Login failed: {response.text}")
        return False
    
    login_response = response.json()
    print("Login successful!")
    login_token = login_response.get('token')
    print(f"Login token: {login_token[:20]}...")
    
    # Step 4: Test dashboard access
    print("\n4. Testing dashboard access...")
    headers = {"Authorization": f"Bearer {login_token}"}
    response = requests.get(f"{BASE_URL}/api/dashboard", headers=headers)
    print(f"Dashboard Status: {response.status_code}")
    
    if response.status_code != 200:
        print(f"Dashboard access failed: {response.text}")
        return False
    
    dashboard_data = response.json()
    print("Dashboard access successful!")
    print(f"Total tasks: {dashboard_data['statistics']['total_tasks']}")
    print(f"Pending tasks: {dashboard_data['statistics']['pending_tasks']}")
    
    # Step 5: Test creating a task
    print("\n5. Testing task creation...")
    task_data = {
        "title": "Test Task from Registration Flow",
        "description": "This task was created during the registration test",
        "status": "pending",
        "priority": "medium"
    }
    response = requests.post(f"{BASE_URL}/api/tasks", json=task_data, headers=headers)
    print(f"Task Creation Status: {response.status_code}")
    
    if response.status_code != 200:
        print(f"Task creation failed: {response.text}")
        return False
    
    task_response = response.json()
    print("Task creation successful!")
    print(f"Task ID: {task_response['task']['id']}")
    print(f"Task Title: {task_response['task']['title']}")
    
    # Step 6: Test dashboard again to see the new task
    print("\n6. Testing dashboard after task creation...")
    response = requests.get(f"{BASE_URL}/api/dashboard", headers=headers)
    
    if response.status_code == 200:
        dashboard_data = response.json()
        print("Dashboard access successful!")
        print(f"Total tasks: {dashboard_data['statistics']['total_tasks']}")
        print(f"Recent tasks: {len(dashboard_data['recent_tasks'])}")
    
    print("\n=== All tests passed! ===")
    return True

def test_existing_users():
    """Test login with existing users"""
    print("\n=== Testing Existing Users ===")
    
    existing_users = [
        {"username": "admin", "password": "admin123"},
        {"username": "testuser", "password": "password123"}
    ]
    
    for user_data in existing_users:
        print(f"\nTesting login for: {user_data['username']}")
        response = requests.post(f"{BASE_URL}/api/auth/login", json=user_data)
        
        if response.status_code == 200:
            login_response = response.json()
            token = login_response.get('token')
            
            # Test dashboard access
            headers = {"Authorization": f"Bearer {token}"}
            dashboard_response = requests.get(f"{BASE_URL}/api/dashboard", headers=headers)
            
            if dashboard_response.status_code == 200:
                print(f"✅ {user_data['username']}: Login and dashboard access successful")
            else:
                print(f"❌ {user_data['username']}: Dashboard access failed")
        else:
            print(f"❌ {user_data['username']}: Login failed")

def main():
    """Run all tests"""
    print("Testing TugasKu Registration and Dashboard Flow\n")
    
    # Test existing users first
    test_existing_users()
    
    # Test new user registration flow
    success = test_registration_and_dashboard()
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
