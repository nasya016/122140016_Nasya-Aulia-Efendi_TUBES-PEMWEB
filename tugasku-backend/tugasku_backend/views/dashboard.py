import logging
from pyramid.view import view_config
from ..database.connection import DBSession
from ..models.task import Task
from ..models.category import Category
from ..middleware.auth import require_auth

logger = logging.getLogger(__name__)

@view_config(route_name='dashboard', request_method='GET', renderer='json')
@require_auth
def get_dashboard(request):
    """Get dashboard statistics"""
    try:
        user = request.current_user
        
        # Get task statistics
        total_tasks = DBSession.query(Task).filter(Task.user_id == user.id).count()
        pending_tasks = DBSession.query(Task).filter(
            Task.user_id == user.id, 
            Task.status == 'pending'
        ).count()
        in_progress_tasks = DBSession.query(Task).filter(
            Task.user_id == user.id, 
            Task.status == 'in_progress'
        ).count()
        completed_tasks = DBSession.query(Task).filter(
            Task.user_id == user.id, 
            Task.status == 'completed'
        ).count()
        
        # Get recent tasks
        recent_tasks = DBSession.query(Task).filter(
            Task.user_id == user.id
        ).order_by(Task.created_at.desc()).limit(5).all()
        
        # Get category statistics
        categories = DBSession.query(Category).all()
        category_stats = []
        for category in categories:
            task_count = DBSession.query(Task).filter(
                Task.category_id == category.id, 
                Task.user_id == user.id
            ).count()
            if task_count > 0:
                category_stats.append({
                    'category': category.to_dict(),
                    'task_count': task_count
                })
        
        return {
            'statistics': {
                'total_tasks': total_tasks,
                'pending_tasks': pending_tasks,
                'in_progress_tasks': in_progress_tasks,
                'completed_tasks': completed_tasks
            },
            'recent_tasks': [task.to_dict() for task in recent_tasks],
            'category_stats': category_stats
        }
    except Exception as e:
        logger.error(f"Dashboard error: {e}", exc_info=True)
        raise

def includeme(config):
    """Include dashboard routes"""
    config.add_route('dashboard', '/api/dashboard')
    
    # Scan this module to register views
    config.scan(__name__)
