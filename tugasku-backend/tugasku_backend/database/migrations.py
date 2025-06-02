from sqlalchemy import text
from .connection import engine, DBSession
import logging

logger = logging.getLogger(__name__)

def run_migrations():
    """Run database migrations"""
    try:
        # Add any migration scripts here
        logger.info("Running database migrations...")
        
        # Example migration
        # with engine.connect() as conn:
        #     conn.execute(text("ALTER TABLE tasks ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE"))
        
        logger.info("Database migrations completed successfully")
    except Exception as e:
        logger.error(f"Migration failed: {e}")
        raise
