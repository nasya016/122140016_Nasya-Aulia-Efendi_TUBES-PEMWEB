import unittest
import json
from pyramid import testing
from pyramid.testing import DummyRequest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from tugasku_backend.database import Base, DBSession
from tugasku_backend.models import User, Task, Category
from tugasku_backend.views import create_task, get_tasks, update_task, delete_task
import tempfile
import os

class TaskTestCase(unittest.TestCase):
    
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
        
        # Create test user
        self.user = User(username='testuser', email='test@example.com')
        self.user.set_password('password123')
        DBSession.add(self.user)
        DBSession.flush()
        
        # Create test category
        self.category = Category(name='Test Category', description='Test description')
        DBSession.add(self.category)
        DBSession.flush()
        
    def tearDown(self):
        testing.tearDown()
        os.close(self.db_fd)
        os.unlink(self.db_path)
        DBSession.remove()
    
    def test_create_task_success(self):
        """Test successful task creation"""
        request = DummyRequest()
        request.current_user = self.user
        request.json_body = {
            'title': 'Test Task',
            'description': 'Test description',
            'status': 'pending',
            'priority': 'high',
            'category_id': self.category.id
        }
        
        response = create_task(request)
        
        self.assertIn('message', response)
        self.assertIn('task', response)
        self.assertEqual(response['task']['title'], 'Test Task')
        self.assertEqual(response['task']['status'], 'pending')
        
        # Verify task was created in database
        task = DBSession.query(Task).filter(Task.title == 'Test Task').first()
        self.assertIsNotNone(task)
        self.assertEqual(task.user_id, self.user.id)
    
    def test_create_task_missing_title(self):
        """Test task creation with missing title"""
        request = DummyRequest()
        request.current_user = self.user
        request.json_body = {
            'description': 'Test description'
            # missing title
        }
        
        response = create_task(request)
        self.assertEqual(response.status_code, 400)
    
    def test_create_task_invalid_category(self):
        """Test task creation with invalid category"""
        request = DummyRequest()
        request.current_user = self.user
        request.json_body = {
            'title': 'Test Task',
            'category_id': 99999  # non-existent category
        }
        
        response = create_task(request)
        self.assertEqual(response.status_code, 400)
    
    def test_get_tasks_success(self):
        """Test getting user tasks"""
        # Create test tasks
        task1 = Task(title='Task 1', user_id=self.user.id, status='pending')
        task2 = Task(title='Task 2', user_id=self.user.id, status='completed')
        DBSession.add_all([task1, task2])
        DBSession.flush()
        
        request = DummyRequest()
        request.current_user = self.user
        request.params = {}
        
        response = get_tasks(request)
        
        self.assertIn('tasks', response)
        self.assertIn('total', response)
        self.assertEqual(response['total'], 2)
    
    def test_get_tasks_with_search(self):
        """Test getting tasks with search filter"""
        # Create test tasks
        task1 = Task(title='Important Task', user_id=self.user.id)
        task2 = Task(title='Regular Task', user_id=self.user.id)
        DBSession.add_all([task1, task2])
        DBSession.flush()
        
        request = DummyRequest()
        request.current_user = self.user
        request.params = {'search': 'Important'}
        
        response = get_tasks(request)
        
        self.assertEqual(response['total'], 1)
        self.assertEqual(response['tasks'][0]['title'], 'Important Task')
    
    def test_update_task_success(self):
        """Test successful task update"""
        # Create test task
        task = Task(title='Original Title', user_id=self.user.id, status='pending')
        DBSession.add(task)
        DBSession.flush()
        
        request = DummyRequest()
        request.current_user = self.user
        request.matchdict = {'id': str(task.id)}
        request.json_body = {
            'title': 'Updated Title',
            'status': 'completed'
        }
        
        response = update_task(request)
        
        self.assertIn('message', response)
        self.assertEqual(response['task']['title'], 'Updated Title')
        self.assertEqual(response['task']['status'], 'completed')
        
        # Verify task was updated in database
        updated_task = DBSession.query(Task).get(task.id)
        self.assertEqual(updated_task.title, 'Updated Title')
        self.assertEqual(updated_task.status, 'completed')
    
    def test_update_nonexistent_task(self):
        """Test updating non-existent task"""
        request = DummyRequest()
        request.current_user = self.user
        request.matchdict = {'id': '99999'}
        request.json_body = {'title': 'Updated Title'}
        
        response = update_task(request)
        self.assertEqual(response.status_code, 404)
    
    def test_delete_task_success(self):
        """Test successful task deletion"""
        # Create test task
        task = Task(title='Task to Delete', user_id=self.user.id)
        DBSession.add(task)
        DBSession.flush()
        task_id = task.id
        
        request = DummyRequest()
        request.current_user = self.user
        request.matchdict = {'id': str(task_id)}
        
        response = delete_task(request)
        
        self.assertIn('message', response)
        
        # Verify task was deleted from database
        deleted_task = DBSession.query(Task).get(task_id)
        self.assertIsNone(deleted_task)
    
    def test_delete_nonexistent_task(self):
        """Test deleting non-existent task"""
        request = DummyRequest()
        request.current_user = self.user
        request.matchdict = {'id': '99999'}
        
        response = delete_task(request)
        self.assertEqual(response.status_code, 404)

if __name__ == '__main__':
    unittest.main()
