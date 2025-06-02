import logging
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest, HTTPConflict, HTTPUnauthorized
from sqlalchemy import or_
from ..database.connection import DBSession
from ..models.user import User
from ..middleware.auth import require_auth
from ..utils.validators import validate_user_data

logger = logging.getLogger(__name__)

@view_config(route_name='register', request_method='POST', renderer='json')
def register(request):
    """User registration"""
    try:
        data = request.json_body
        validate_user_data(data)
        
        # Check if user already exists
        existing_user = DBSession.query(User).filter(
            or_(User.username == data['username'], User.email == data['email'])
        ).first()
        
        if existing_user:
            if existing_user.username == data['username']:
                raise HTTPConflict('Username already exists')
            else:
                raise HTTPConflict('Email already exists')
        
        # Create new user
        user = User(
            username=data['username'].strip(),
            email=data['email'].strip()
        )
        user.set_password(data['password'])
        
        DBSession.add(user)
        DBSession.flush()  # Flush to get the ID
        
        # Commit the transaction to ensure user is saved
        DBSession.commit()
        
        # Generate token after user is committed
        token = user.generate_token()
        
        logger.info(f"User registered successfully: {user.username} (ID: {user.id})")
        
        return {
            'message': 'User registered successfully',
            'user': user.to_dict(),
            'token': token
        }
        
    except Exception as e:
        logger.error(f"Registration error: {e}", exc_info=True)
        DBSession.rollback()
        raise

@view_config(route_name='login', request_method='POST', renderer='json')
def login(request):
    """User login"""
    try:
        data = request.json_body
        username_or_email = data.get('username', '').strip()
        password = data.get('password', '')
        
        if not username_or_email or not password:
            raise HTTPBadRequest('Username/email and password are required')
        
        # Log the login attempt for debugging
        logger.info(f"Login attempt for: {username_or_email}")
        
        # Find user by username or email
        user = DBSession.query(User).filter(
            or_(User.username == username_or_email, User.email == username_or_email),
            User.is_active == True
        ).first()
        
        if not user:
            logger.warning(f"User not found: {username_or_email}")
            raise HTTPUnauthorized('User not found')
        
        if not user.check_password(password):
            logger.warning(f"Invalid password for user: {username_or_email}")
            raise HTTPUnauthorized('Invalid password')
        
        token = user.generate_token()
        
        logger.info(f"Login successful for user: {user.username} (ID: {user.id})")
        
        return {
            'message': 'Login successful',
            'user': user.to_dict(),
            'token': token
        }
        
    except Exception as e:
        logger.error(f"Login error: {e}", exc_info=True)
        raise

@view_config(route_name='profile', request_method='GET', renderer='json')
@require_auth
def get_profile(request):
    """Get user profile"""
    try:
        user = request.current_user
        logger.info(f"Profile request for user: {user.username} (ID: {user.id})")
        return {
            'user': user.to_dict()
        }
    except Exception as e:
        logger.error(f"Get profile error: {e}", exc_info=True)
        raise

def includeme(config):
    """Include auth routes"""
    config.add_route('register', '/api/auth/register')
    config.add_route('login', '/api/auth/login')
    config.add_route('profile', '/api/auth/profile')
    
    # Scan this module to register views
    config.scan(__name__)
