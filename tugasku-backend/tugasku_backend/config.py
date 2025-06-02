import os
from typing import Dict, Any

class Config:
    """Base configuration class"""
    
    # Database - Updated with your password
    SQLALCHEMY_URL = os.getenv(
        'DATABASE_URL', 
        'postgresql+psycopg2://postgres:1812nasya@localhost:5432/tugasku_db?client_encoding=utf8'
    )
    SQLALCHEMY_ECHO = os.getenv('SQLALCHEMY_ECHO', 'False').lower() == 'true'
    
    # JWT
    JWT_SECRET = os.getenv('JWT_SECRET', 'your-secret-key-change-in-production')
    JWT_ALGORITHM = 'HS256'
    JWT_EXPIRATION_HOURS = int(os.getenv('JWT_EXPIRATION_HOURS', '24'))
    
    # CORS
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')
    
    # Logging
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    
    # Pagination
    DEFAULT_PAGE_SIZE = int(os.getenv('DEFAULT_PAGE_SIZE', '20'))
    MAX_PAGE_SIZE = int(os.getenv('MAX_PAGE_SIZE', '100'))

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    SQLALCHEMY_ECHO = True
    # Windows-specific database URL with your password
    SQLALCHEMY_URL = os.getenv(
        'DATABASE_URL',
        'postgresql+psycopg2://postgres:1812nasya@localhost:5432/tugasku_db?client_encoding=utf8&connect_timeout=10'
    )

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    SQLALCHEMY_ECHO = False

class TestConfig(Config):
    """Test configuration"""
    TESTING = True
    SQLALCHEMY_URL = 'sqlite:///:memory:'

def get_config() -> Config:
    """Get configuration based on environment"""
    env = os.getenv('ENVIRONMENT', 'development').lower()
    
    config_map = {
        'development': DevelopmentConfig,
        'production': ProductionConfig,
        'test': TestConfig
    }
    
    return config_map.get(env, DevelopmentConfig)()
