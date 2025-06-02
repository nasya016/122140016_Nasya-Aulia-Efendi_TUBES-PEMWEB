import logging
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest
from sqlalchemy import or_
from datetime import datetime
from ..database.connection import DBSession
from ..models.task import Task
from ..models.category import Category
from ..models.task_log import TaskLog
from ..middleware.auth import require_auth
from ..utils.validators import validate_task_data
from ..utils.pagination import paginate

logger = logging.getLogger(__name__)

@view_config(route_name='tasks', request_method='GET', renderer='json')
@require_auth
def get_tasks(request):
    """Get user tasks with filtering and pagination"""
    try:
        user = request.current_user
        query = DBSession.query(Task).filter(Task.user_id == user.id)
        
        # Search functionality
        search = request.params.get('search', '').strip()
        if search:
            query = query.filter(
                or_(
                    Task.title.ilike(f'%{search}%'),
                    Task.description.ilike(f'%{search}%')
                )
            )
        
        # Filters
        category_id = request.params.get('category_id')
        if category_id:
            query = query.filter(Task.category_id == int(category_id))
        
        status = request.params.get('status')
        if status:
            query = query.filter(Task.status == status)
        
        priority = request.params.get('priority')
        if priority:
            query = query.filter(Task.priority == priority)
        
        # Sorting
        sort_by = request.params.get('sort_by', 'created_at')
        sort_order = request.params.get('sort_order', 'desc')
        
        if hasattr(Task, sort_by):
            if sort_order == 'asc':
                query = query.order_by(getattr(Task, sort_by).asc())
            else:
                query = query.order_by(getattr(Task, sort_by).desc())
        
        # Pagination
        page = int(request.params.get('page', 1))
        page_size = int(request.params.get('page_size', 20))
        
        result = paginate(query, page, page_size)
        
        logger.info(f"Retrieved {len(result['items'])} tasks for user {user.username}")
        
        return {
            'tasks': [task.to_dict() for task in result['items']],
            'pagination': {
                'page': result['page'],
                'page_size': result['page_size'],
                'total': result['total'],
                'pages': result['pages']
            }
        }
        
    except Exception as e:
        logger.error(f"Get tasks error: {e}", exc_info=True)
        raise

@view_config(route_name='tasks', request_method='POST', renderer='json')
@require_auth
def create_task(request):
    """Create new task"""
    try:
        data = request.json_body
        validate_task_data(data)
        
        user = request.current_user
        logger.info(f"Creating task for user {user.username}: {data.get('title')}")
        
        # Validate category if provided
        if data.get('category_id'):
            category = DBSession.query(Category).get(data['category_id'])
            if not category:
                raise HTTPBadRequest('Category not found')
        
        # Parse due_date if provided
        due_date = None
        if data.get('due_date'):
            try:
                due_date = datetime.fromisoformat(data['due_date'].replace('Z', '+00:00'))
            except ValueError:
                raise HTTPBadRequest('Invalid due_date format. Use ISO format.')
        
        task = Task(
            title=data['title'].strip(),
            description=data.get('description', '').strip(),
            status=data.get('status', 'pending'),
            priority=data.get('priority', 'medium'),
            due_date=due_date,
            user_id=user.id,
            category_id=data.get('category_id')
        )
        
        DBSession.add(task)
        DBSession.flush()  # Flush to get the ID
        
        # Create initial log
        log_entry = TaskLog(
            task_id=task.id,
            old_status=None,
            new_status=task.status,
            changed_by=user.id,
            notes='Task created'
        )
        DBSession.add(log_entry)
        DBSession.flush()
        
        # Commit the transaction
        DBSession.commit()
        
        logger.info(f"Task created successfully: ID {task.id}, Title: {task.title}")
        
        return {
            'message': 'Task created successfully',
            'task': task.to_dict()
        }
        
    except Exception as e:
        logger.error(f"Create task error: {e}", exc_info=True)
        DBSession.rollback()
        raise

@view_config(route_name='task_by_id', request_method='GET', renderer='json')
@require_auth
def get_task(request):
    """Get single task with logs"""
    try:
        task_id = request.matchdict.get('id')
        user = request.current_user
        
        task = DBSession.query(Task).filter(
            Task.id == task_id,
            Task.user_id == user.id
        ).first()
        
        if not task:
            raise HTTPNotFound('Task not found')
        
        # Get task logs
        logs = DBSession.query(TaskLog).filter(
            TaskLog.task_id == task.id
        ).order_by(TaskLog.created_at.desc()).all()
        
        task_dict = task.to_dict()
        task_dict['logs'] = [log.to_dict() for log in logs]
        
        return {
            'task': task_dict
        }
        
    except Exception as e:
        logger.error(f"Get task error: {e}", exc_info=True)
        raise

@view_config(route_name='task_by_id', request_method='PUT', renderer='json')
@require_auth
def update_task(request):
    """Update task"""
    try:
        task_id = request.matchdict.get('id')
        data = request.json_body
        validate_task_data(data, is_update=True)
        
        user = request.current_user
        
        task = DBSession.query(Task).filter(
            Task.id == task_id,
            Task.user_id == user.id
        ).first()
        
        if not task:
            raise HTTPNotFound('Task not found')
        
        old_status = task.status
        logger.info(f"Updating task {task_id} for user {user.username}")
        
        # Update fields
        for field in ['title', 'description', 'priority']:
            if field in data:
                setattr(task, field, data[field].strip() if isinstance(data[field], str) else data[field])
        
        if 'due_date' in data:
            if data['due_date']:
                try:
                    task.due_date = datetime.fromisoformat(data['due_date'].replace('Z', '+00:00'))
                except ValueError:
                    raise HTTPBadRequest('Invalid due_date format')
            else:
                task.due_date = None
        
        if 'category_id' in data:
            if data['category_id']:
                category = DBSession.query(Category).get(data['category_id'])
                if not category:
                    raise HTTPBadRequest('Category not found')
                task.category_id = data['category_id']
            else:
                task.category_id = None
        
        # Handle status change
        if 'status' in data and data['status'] != old_status:
            task.status = data['status']
            
            # Create log entry for status change
            log_entry = TaskLog(
                task_id=task.id,
                old_status=old_status,
                new_status=task.status,
                changed_by=user.id,
                notes=data.get('status_notes', f'Status changed from {old_status} to {task.status}')
            )
            DBSession.add(log_entry)
        
        DBSession.flush()
        DBSession.commit()
        
        logger.info(f"Task {task_id} updated successfully")
        
        return {
            'message': 'Task updated successfully',
            'task': task.to_dict()
        }
        
    except Exception as e:
        logger.error(f"Update task error: {e}", exc_info=True)
        DBSession.rollback()
        raise

@view_config(route_name='task_by_id', request_method='DELETE', renderer='json')
@require_auth
def delete_task(request):
    """Delete task"""
    try:
        task_id = request.matchdict.get('id')
        user = request.current_user
        
        task = DBSession.query(Task).filter(
            Task.id == task_id,
            Task.user_id == user.id
        ).first()
        
        if not task:
            raise HTTPNotFound('Task not found')
        
        logger.info(f"Deleting task {task_id} for user {user.username}")
        
        DBSession.delete(task)
        DBSession.flush()
        DBSession.commit()
        
        logger.info(f"Task {task_id} deleted successfully")
        
        return {'message': 'Task deleted successfully'}
        
    except Exception as e:
        logger.error(f"Delete task error: {e}", exc_info=True)
        DBSession.rollback()
        raise

def includeme(config):
    """Include task routes"""
    config.add_route('tasks', '/api/tasks')
    config.add_route('task_by_id', '/api/tasks/{id}')
    
    # Scan this module to register views
    config.scan(__name__)
