import jwt
import logging
from pyramid.httpexceptions import HTTPUnauthorized
from ..database.connection import DBSession
from ..models.user import User
from ..config import get_config

config = get_config()
logger = logging.getLogger(__name__)

def get_current_user(request):
    """Extract user from JWT token"""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        logger.warning("Missing or invalid authorization header")
        raise HTTPUnauthorized('Missing or invalid authorization header')
    
    token = auth_header.split(' ')[1]
    
    try:
        payload = jwt.decode(token, config.JWT_SECRET, algorithms=[config.JWT_ALGORITHM])
        user_id = payload.get('user_id')
        
        logger.debug(f"Token decoded successfully for user_id: {user_id}")
        
        user = DBSession.query(User).filter(
            User.id == user_id, 
            User.is_active == True
        ).first()
        
        if not user:
            logger.warning(f"User not found or inactive for user_id: {user_id}")
            raise HTTPUnauthorized('User not found or inactive')
        
        logger.debug(f"User authenticated: {user.username} (ID: {user.id})")
        return user
        
    except jwt.ExpiredSignatureError:
        logger.warning("Token has expired")
        raise HTTPUnauthorized('Token has expired')
    except jwt.InvalidTokenError as e:
        logger.warning(f"Invalid token: {e}")
        raise HTTPUnauthorized('Invalid token')
    except Exception as e:
        logger.error(f"Authentication error: {e}")
        raise HTTPUnauthorized('Authentication failed')

def require_auth(func):
    """Decorator for endpoints that require authentication"""
    def wrapper(request):
        request.current_user = get_current_user(request)
        return func(request)
    return wrapper

class AuthMiddleware:
    """Authentication middleware"""
    
    def __init__(self, handler, registry):
        self.handler = handler
        self.registry = registry
    
    def __call__(self, request):
        # Add authentication logic here if needed
        return self.handler(request)
