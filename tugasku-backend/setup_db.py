#!/usr/bin/env python
"""
Database setup script for TugasKu
"""
import os
import sys
import logging

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from tugasku_backend.database.connection import init_db, test_connection, DBSession
from tugasku_backend.models import User, Category
from tugasku_backend.utils.logging import setup_logging

def create_sample_data():
    """Create sample users and categories"""
    try:
        logger = logging.getLogger(__name__)
        logger.info("Creating sample data...")
        
        # Check if admin user already exists
        admin_user = DBSession.query(User).filter(User.username == 'admin').first()
        if not admin_user:
            # Create admin user
            admin_user = User(
                username='admin',
                email='admin@tugasku.com'
            )
            admin_user.set_password('admin123')
            DBSession.add(admin_user)
            logger.info("Created admin user (username: admin, password: admin123)")
        
        # Check if test user already exists
        test_user = DBSession.query(User).filter(User.username == 'testuser').first()
        if not test_user:
            # Create test user
            test_user = User(
                username='testuser',
                email='test@example.com'
            )
            test_user.set_password('password123')
            DBSession.add(test_user)
            logger.info("Created test user (username: testuser, password: password123)")
        
        # Create sample categories
        categories = [
            {'name': 'Work', 'description': 'Work-related tasks'},
            {'name': 'Personal', 'description': 'Personal tasks and activities'},
            {'name': 'Study', 'description': 'Learning and educational tasks'},
            {'name': 'Health', 'description': 'Health and fitness related tasks'},
            {'name': 'Shopping', 'description': 'Shopping and errands'}
        ]
        
        for cat_data in categories:
            existing_cat = DBSession.query(Category).filter(Category.name == cat_data['name']).first()
            if not existing_cat:
                category = Category(
                    name=cat_data['name'],
                    description=cat_data['description']
                )
                DBSession.add(category)
                logger.info(f"Created category: {cat_data['name']}")
        
        # Commit all changes
        DBSession.commit()
        logger.info("Sample data created successfully!")
        
    except Exception as e:
        logger.error(f"Failed to create sample data: {e}")
        DBSession.rollback()
        raise

def main():
    """Initialize the database and create sample data"""
    # Setup logging
    setup_logging()
    logger = logging.getLogger(__name__)
    
    try:
        logger.info("Starting database setup...")
        
        # Test connection first
        if not test_connection():
            logger.error("Cannot connect to database. Please check your configuration.")
            logger.error("Make sure PostgreSQL is running and the database exists.")
            return False
        
        # Initialize database
        init_db()
        logger.info("Database tables created successfully!")
        
        # Create sample data
        create_sample_data()
        
        logger.info("Database setup completed successfully!")
        logger.info("\nYou can now login with:")
        logger.info("  Admin: username='admin', password='admin123'")
        logger.info("  Test User: username='testuser', password='password123'")
        
        return True
        
    except Exception as e:
        logger.error(f"Database setup failed: {e}")
        return False

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
