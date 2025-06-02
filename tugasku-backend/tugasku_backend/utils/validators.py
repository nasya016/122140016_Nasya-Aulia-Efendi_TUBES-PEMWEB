from pyramid.httpexceptions import HTTPBadRequest
import re
from typing import Dict, Any, List

def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_user_data(data: Dict[str, Any], is_update: bool = False) -> bool:
    """Validate user data for register/update"""
    errors: List[str] = []
    
    if not is_update or 'username' in data:
        username = data.get('username', '').strip()
        if not username:
            errors.append('Username is required')
        elif len(username) < 3:
            errors.append('Username must be at least 3 characters')
        elif len(username) > 50:
            errors.append('Username must be less than 50 characters')
        elif not re.match(r'^[a-zA-Z0-9_]+$', username):
            errors.append('Username can only contain letters, numbers, and underscores')
    
    if not is_update or 'email' in data:
        email = data.get('email', '').strip()
        if not email:
            errors.append('Email is required')
        elif not validate_email(email):
            errors.append('Invalid email format')
    
    if not is_update or 'password' in data:
        password = data.get('password', '')
        if not password:
            errors.append('Password is required')
        elif len(password) < 6:
            errors.append('Password must be at least 6 characters')
    
    if errors:
        raise HTTPBadRequest(json_body={'errors': errors})
    
    return True

def validate_task_data(data: Dict[str, Any], is_update: bool = False) -> bool:
    """Validate task data"""
    errors: List[str] = []
    
    if not is_update or 'title' in data:
        title = data.get('title', '').strip()
        if not title:
            errors.append('Title is required')
        elif len(title) > 255:
            errors.append('Title must be less than 255 characters')
    
    if 'status' in data:
        status = data.get('status')
        valid_statuses = ['pending', 'in_progress', 'completed']
        if status and status not in valid_statuses:
            errors.append(f'Status must be one of: {", ".join(valid_statuses)}')
    
    if 'priority' in data:
        priority = data.get('priority')
        valid_priorities = ['low', 'medium', 'high']
        if priority and priority not in valid_priorities:
            errors.append(f'Priority must be one of: {", ".join(valid_priorities)}')
    
    if 'description' in data:
        description = data.get('description', '')
        if len(description) > 2000:
            errors.append('Description must be less than 2000 characters')
    
    if errors:
        raise HTTPBadRequest(json_body={'errors': errors})
    
    return True

def validate_category_data(data: Dict[str, Any], is_update: bool = False) -> bool:
    """Validate category data"""
    errors: List[str] = []
    
    if not is_update or 'name' in data:
        name = data.get('name', '').strip()
        if not name:
            errors.append('Name is required')
        elif len(name) > 100:
            errors.append('Name must be less than 100 characters')
    
    if 'description' in data:
        description = data.get('description', '')
        if len(description) > 500:
            errors.append('Description must be less than 500 characters')
    
    if errors:
        raise HTTPBadRequest(json_body={'errors': errors})
    
    return True
