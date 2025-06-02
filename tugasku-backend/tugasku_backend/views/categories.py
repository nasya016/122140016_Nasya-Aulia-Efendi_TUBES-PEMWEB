import logging
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest, HTTPConflict
from ..database.connection import DBSession
from ..models.category import Category
from ..models.task import Task
from ..middleware.auth import require_auth
from ..utils.validators import validate_category_data

logger = logging.getLogger(__name__)

@view_config(route_name='categories', request_method='GET', renderer='json')
@require_auth
def get_categories(request):
    """Get all categories"""
    try:
        categories = DBSession.query(Category).all()
        return {
            'categories': [category.to_dict() for category in categories]
        }
    except Exception as e:
        logger.error(f"Get categories error: {e}", exc_info=True)
        raise

@view_config(route_name='categories', request_method='POST', renderer='json')
@require_auth
def create_category(request):
    """Create new category"""
    try:
        data = request.json_body
        validate_category_data(data)
        
        # Check if category already exists
        existing = DBSession.query(Category).filter(
            Category.name == data['name'].strip()
        ).first()
        if existing:
            raise HTTPConflict('Category already exists')
        
        category = Category(
            name=data['name'].strip(),
            description=data.get('description', '').strip()
        )
        
        DBSession.add(category)
        DBSession.flush()
        
        return {
            'message': 'Category created successfully',
            'category': category.to_dict()
        }
    except Exception as e:
        logger.error(f"Create category error: {e}", exc_info=True)
        DBSession.rollback()
        raise

@view_config(route_name='category_by_id', request_method='PUT', renderer='json')
@require_auth
def update_category(request):
    """Update category"""
    try:
        category_id = request.matchdict.get('id')
        data = request.json_body
        validate_category_data(data, is_update=True)
        
        category = DBSession.query(Category).get(category_id)
        if not category:
            raise HTTPNotFound('Category not found')
        
        # Check for duplicate name if name is being updated
        if 'name' in data and data['name'].strip() != category.name:
            existing = DBSession.query(Category).filter(
                Category.name == data['name'].strip()
            ).first()
            if existing:
                raise HTTPConflict('Category name already exists')
        
        # Update fields
        if 'name' in data:
            category.name = data['name'].strip()
        if 'description' in data:
            category.description = data['description'].strip()
        
        DBSession.flush()
        
        return {
            'message': 'Category updated successfully',
            'category': category.to_dict()
        }
    except Exception as e:
        logger.error(f"Update category error: {e}", exc_info=True)
        DBSession.rollback()
        raise

@view_config(route_name='category_by_id', request_method='DELETE', renderer='json')
@require_auth
def delete_category(request):
    """Delete category"""
    try:
        category_id = request.matchdict.get('id')
        
        category = DBSession.query(Category).get(category_id)
        if not category:
            raise HTTPNotFound('Category not found')
        
        # Check if category has tasks
        task_count = DBSession.query(Task).filter(
            Task.category_id == category_id
        ).count()
        if task_count > 0:
            raise HTTPBadRequest(
                f'Cannot delete category. It has {task_count} associated tasks.'
            )
        
        DBSession.delete(category)
        DBSession.flush()
        
        return {'message': 'Category deleted successfully'}
    except Exception as e:
        logger.error(f"Delete category error: {e}", exc_info=True)
        DBSession.rollback()
        raise

def includeme(config):
    """Include category routes"""
    config.add_route('categories', '/api/categories')
    config.add_route('category_by_id', '/api/categories/{id}')
    
    # Scan this module to register views
    config.scan(__name__)
