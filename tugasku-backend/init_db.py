#!/usr/bin/env python
"""
Database initialization script
"""
import os
import sys
import logging

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from tugasku_backend.database.connection import init_db, test_connection
from tugasku_backend.utils.logging import setup_logging

def main():
    """Initialize the database"""
    # Setup logging
    setup_logging()
    logger = logging.getLogger(__name__)
    
    try:
        logger.info("Starting database initialization...")
        
        # Test connection first
        if not test_connection():
            logger.error("Cannot connect to database. Please check your configuration.")
            return False
        
        # Initialize database
        init_db()
        logger.info("Database initialization completed successfully!")
        return True
        
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        return False

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
