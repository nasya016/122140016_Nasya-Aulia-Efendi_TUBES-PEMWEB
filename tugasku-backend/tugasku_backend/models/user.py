from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship
from .base import BaseModel
import bcrypt
import jwt
from datetime import datetime, timedelta
from ..config import get_config
import logging

logger = logging.getLogger(__name__)
config = get_config()

class User(BaseModel):
    __tablename__ = 'users'

    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)

    # Relationships
    tasks = relationship('Task', back_populates='user', cascade='all, delete-orphan')

    def set_password(self, password: str) -> None:
        """Hash and set password"""
        try:
            self.password_hash = bcrypt.hashpw(
                password.encode('utf-8'), 
                bcrypt.gensalt()
            ).decode('utf-8')
        except Exception as e:
            logger.error(f"Error setting password: {e}")
            raise

    def check_password(self, password: str) -> bool:
        """Verify password"""
        try:
            # Log for debugging
            logger.debug(f"Checking password for user: {self.username}")
            
            # Ensure password and hash are properly encoded
            password_bytes = password.encode('utf-8')
            hash_bytes = self.password_hash.encode('utf-8')
            
            # Check password
            result = bcrypt.checkpw(password_bytes, hash_bytes)
            
            logger.debug(f"Password check result: {result}")
            return result
        except Exception as e:
            logger.error(f"Error checking password: {e}")
            return False

    def generate_token(self) -> str:
        """Generate JWT token"""
        try:
            payload = {
                'user_id': self.id,
                'username': self.username,
                'exp': datetime.utcnow() + timedelta(hours=config.JWT_EXPIRATION_HOURS)
            }
            return jwt.encode(payload, config.JWT_SECRET, algorithm=config.JWT_ALGORITHM)
        except Exception as e:
            logger.error(f"Error generating token: {e}")
            raise

    def to_dict(self) -> dict:
        """Convert to dictionary (exclude sensitive data)"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
