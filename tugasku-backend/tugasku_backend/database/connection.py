from sqlalchemy import create_engine, text
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from ..config import get_config
import logging

logger = logging.getLogger(__name__)

config = get_config()

# Create engine with improved Windows compatibility
engine_kwargs = {
    'echo': config.SQLALCHEMY_ECHO,
    'pool_pre_ping': True,
    'pool_recycle': 300,
    'pool_timeout': 20,
    'connect_args': {
        'connect_timeout': 10,
        'client_encoding': 'utf8'
    }
}

engine = create_engine(config.SQLALCHEMY_URL, **engine_kwargs)

# Create session
DBSession = scoped_session(sessionmaker(bind=engine))

# Base class for models
Base = declarative_base()

def init_db():
    """Initialize database tables"""
    try:
        logger.info("Initializing database...")
        
        # Test connection first
        test_connection()
        
        # Import models to register them
        from ..models import User, Task, Category, TaskLog
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
        
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise

def test_connection():
    """Test database connection"""
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            row = result.fetchone()
            logger.info(f"Database connection successful: {row}")
            return True
    except Exception as e:
        logger.error(f"Database connection test failed: {e}")
        return False
