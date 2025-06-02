#!/usr/bin/env python
"""
Test task creation and persistence
"""
import requests
import json
import sys
import time

BASE_URL = "http://localhost:6543"

def login_user(username, password):
    """Login and return token"""
    login_data = {
        "username": username,
        "password": password
    }
    response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
    
    if response.status_code == 200:
        return response.json().get('token')
    else:
        print(f"Login failed: {response.text}")
        return None

def test_task_creation_persistence():
    """Test if tasks are properly created and persist"""
    print("=== Testing Task Creation and Persistence ===\n")
    
    # Login with test user
    print("1. Logging in...")
    token = login_user("admin", "admin123")
    if not token:
        print("Failed to login")
        return False
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Get initial task count
    print("2. Getting initial task list...")
    response = requests.get(f"{BASE_URL}/api/tasks", headers=headers)
    if response.status_code != 200:
        print(f"Failed to get tasks: {response.text}")
        return False
    
    initial_tasks = response.json()
    initial_count = initial_tasks['pagination']['total']
    print(f"Initial task count: {initial_count}")
    
    # Create a new task
    print("3. Creating new task...")
    task_data = {
        "title": f"Test Task {int(time.time())}",
        "description": "This is a test task to check persistence",
        "status": "pending",
        "priority": "high"
    }
    
    response = requests.post(f"{BASE_URL}/api/tasks", json=task_data, headers=headers)
    print(f"Task creation status: {response.status_code}")
    
    if response.status_code != 200:
        print(f"Task creation failed: {response.text}")
        return False
    
    created_task = response.json()
    task_id = created_task['task']['id']
    print(f"Task created successfully!")
    print(f"Task ID: {task_id}")
    print(f"Task Title: {created_task['task']['title']}")
    
    # Wait a moment
    time.sleep(1)
    
    # Get updated task list
    print("4. Getting updated task list...")
    response = requests.get(f"{BASE_URL}/api/tasks", headers=headers)
    if response.status_code != 200:
        print(f"Failed to get updated tasks: {response.text}")
        return False
    
    updated_tasks = response.json()
    updated_count = updated_tasks['pagination']['total']
    print(f"Updated task count: {updated_count}")
    
    if updated_count != initial_count + 1:
        print(f"❌ Task count mismatch! Expected {initial_count + 1}, got {updated_count}")
        return False
    
    # Check if our specific task exists
    task_found = False
    for task in updated_tasks['tasks']:
        if task['id'] == task_id:
            task_found = True
            print(f"✅ Task found in list: {task['title']}")
            break
    
    if not task_found:
        print(f"❌ Created task not found in task list!")
        return False
    
    # Get the specific task by ID
    print("5. Getting task by ID...")
    response = requests.get(f"{BASE_URL}/api/tasks/{task_id}", headers=headers)
    if response.status_code != 200:
        print(f"Failed to get task by ID: {response.text}")
        return False
    
    task_detail = response.json()
    print(f"✅ Task retrieved by ID: {task_detail['task']['title']}")
    
    # Test task update
    print("6. Testing task update...")
    update_data = {
        "title": f"Updated Test Task {int(time.time())}",
        "status": "in_progress"
    }
    
    response = requests.put(f"{BASE_URL}/api/tasks/{task_id}", json=update_data, headers=headers)
    if response.status_code != 200:
        print(f"Task update failed: {response.text}")
        return False
    
    updated_task = response.json()
    print(f"✅ Task updated: {updated_task['task']['title']}")
    print(f"✅ Status changed to: {updated_task['task']['status']}")
    
    # Verify the update persisted
    print("7. Verifying update persistence...")
    response = requests.get(f"{BASE_URL}/api/tasks/{task_id}", headers=headers)
    if response.status_code == 200:
        task_detail = response.json()
        if task_detail['task']['status'] == 'in_progress':
            print("✅ Task update persisted correctly")
        else:
            print(f"❌ Task update not persisted. Status: {task_detail['task']['status']}")
            return False
    
    # Test dashboard to see if it reflects the changes
    print("8. Checking dashboard...")
    response = requests.get(f"{BASE_URL}/api/dashboard", headers=headers)
    if response.status_code == 200:
        dashboard = response.json()
        print(f"Dashboard stats:")
        print(f"  Total tasks: {dashboard['statistics']['total_tasks']}")
        print(f"  Pending: {dashboard['statistics']['pending_tasks']}")
        print(f"  In Progress: {dashboard['statistics']['in_progress_tasks']}")
        print(f"  Completed: {dashboard['statistics']['completed_tasks']}")
    
    print("\n✅ All task persistence tests passed!")
    return True

def test_multiple_task_operations():
    """Test multiple task operations in sequence"""
    print("\n=== Testing Multiple Task Operations ===\n")
    
    token = login_user("testuser", "password123")
    if not token:
        return False
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create multiple tasks
    task_ids = []
    for i in range(3):
        task_data = {
            "title": f"Batch Test Task {i+1}",
            "description": f"Task {i+1} in batch test",
            "status": "pending",
            "priority": "medium"
        }
        
        response = requests.post(f"{BASE_URL}/api/tasks", json=task_data, headers=headers)
        if response.status_code == 200:
            task_id = response.json()['task']['id']
            task_ids.append(task_id)
            print(f"Created task {i+1}: ID {task_id}")
        else:
            print(f"Failed to create task {i+1}")
            return False
    
    # Verify all tasks exist
    response = requests.get(f"{BASE_URL}/api/tasks", headers=headers)
    if response.status_code == 200:
        tasks = response.json()['tasks']
        found_count = 0
        for task_id in task_ids:
            for task in tasks:
                if task['id'] == task_id:
                    found_count += 1
                    break
        
        print(f"Found {found_count} out of {len(task_ids)} created tasks")
        if found_count == len(task_ids):
            print("✅ All batch tasks found")
        else:
            print("❌ Some batch tasks missing")
            return False
    
    return True

def main():
    """Run all tests"""
    print("Testing Task Creation and Persistence\n")
    
    # Test basic task operations
    success1 = test_task_creation_persistence()
    
    # Test multiple operations
    success2 = test_multiple_task_operations()
    
    return success1 and success2

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
