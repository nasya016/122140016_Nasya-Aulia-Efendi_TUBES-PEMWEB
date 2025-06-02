import unittest
import json
from pyramid import testing
from pyramid.paster import get_appsettings
from pyramid.testing import DummyRequest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from tugasku_backend import main
from tugasku_backend.database import Base, DBSession
from tugasku_backend.models import User
from tugasku_backend.views import register, login
import tempfile
import os

class AuthTestCase(unittest.TestCase):
    
    def setUp(self):
        # Create temporary database
        self.db_fd, self.db_path = tempfile.mkstemp()
        
        # Setup test database
        engine = create_engine(f'sqlite:///{self.db_path}')
        Base.metadata.create_all(engine)
        
        # Configure session
        Session = sessionmaker(bind=engine)
        DBSession.configure(bind=engine)
        self.session = Session()
        
        # Setup pyramid config
        self.config = testing.setUp()
        
    def tearDown(self):
        testing.tearDown()
        os.close(self.db_fd)
        os.unlink(self.db_path)
        DBSession.remove()
    
    def test_register_success(self):
        """Test successful user registration"""
        request = DummyRequest()
        request.json_body = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'password123'
        }
        
        response = register(request)
        
        self.assertIn('message', response)
        self.assertIn('user', response)
        self.assertIn('token', response)
        self.assertEqual(response['user']['username'], 'testuser')
        
        # Verify user was created in database
        user = DBSession.query(User).filter(User.username == 'testuser').first()
        self.assertIsNotNone(user)
        self.assertEqual(user.email, 'test@example.com')
    
    def test_register_duplicate_username(self):
        """Test registration with duplicate username"""
        # Create first user
        user = User(username='testuser', email='test1@example.com')
        user.set_password('password123')
        DBSession.add(user)
        DBSession.flush()
        
        # Try to register with same username
        request = DummyRequest()
        request.json_body = {
            'username': 'testuser',
            'email': 'test2@example.com',
            'password': 'password123'
        }
        
        response = register(request)
        self.assertEqual(response.status_code, 409)
    
    def test_register_invalid_email(self):
        """Test registration with invalid email"""
        request = DummyRequest()
        request.json_body = {
            'username': 'testuser',
            'email': 'invalid-email',
            'password': 'password123'
        }
        
        response = register(request)
        self.assertEqual(response.status_code, 400)
    
    def test_login_success(self):
        """Test successful login"""
        # Create user
        user = User(username='testuser', email='test@example.com')
        user.set_password('password123')
        DBSession.add(user)
        DBSession.flush()
        
        # Login
        request = DummyRequest()
        request.json_body = {
            'username': 'testuser',
            'password': 'password123'
        }
        
        response = login(request)
        
        self.assertIn('message', response)
        self.assertIn('user', response)
        self.assertIn('token', response)
        self.assertEqual(response['user']['username'], 'testuser')
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        # Create user
        user = User(username='testuser', email='test@example.com')
        user.set_password('password123')
        DBSession.add(user)
        DBSession.flush()
        
        # Try login with wrong password
        request = DummyRequest()
        request.json_body = {
            'username': 'testuser',
            'password': 'wrongpassword'
        }
        
        response = login(request)
        self.assertEqual(response.status_code, 401)
    
    def test_login_missing_credentials(self):
        """Test login with missing credentials"""
        request = DummyRequest()
        request.json_body = {
            'username': 'testuser'
            # missing password
        }
        
        response = login(request)
        self.assertEqual(response.status_code, 400)

if __name__ == '__main__':
    unittest.main()
