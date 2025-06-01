import logging
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest
from .database import DBSession
from .models import User, Task, Category

log = logging.getLogger(__name__)

@view_config(route_name='home', renderer='json')
def home_view(request):
    return {"message": "Selamat datang di API TugasKu"}

@view_config(route_name='tasks', request_method='GET', renderer='json')
def tasks_view(request):
    try:
        tasks = DBSession.query(Task).all()
        return [
            {
                "id": t.id,
                "title": t.title,
                "category": {
                    "id": t.category.id,
                    "name": t.category.name,
                } if t.category else None
            }
            for t in tasks
        ]
    except Exception as e:
        log.error(f"Error fetching tasks: {e}", exc_info=True)
        request.response.status = 500
        return {"error": "Internal server error"}

@view_config(route_name='tasks', request_method='POST', renderer='json')
def add_task(request):
    try:
        data = request.json_body
        title = data.get('title')
        category_id = data.get('category_id')

        if not title:
            return HTTPBadRequest(json_body={'error': 'Title is required'})

        category = None
        if category_id is not None:
            category = DBSession.query(Category).get(category_id)
            if not category:
                return HTTPBadRequest(json_body={'error': 'Category not found'})

        task = Task(title=title)
        if category:
            task.category = category

        DBSession.add(task)
        DBSession.flush()  # supaya dapat id baru

        return {
            "id": task.id,
            "title": task.title,
            "category": {
                "id": task.category.id,
                "name": task.category.name,
            } if task.category else None
        }
    except Exception as e:
        log.error("Failed to add task", exc_info=True)
        request.response.status = 500
        return {"error": str(e)}

@view_config(route_name='task_by_id', request_method='PUT', renderer='json')
def update_task(request):
    try:
        task_id = request.matchdict.get('id')
        task = DBSession.query(Task).filter(Task.id == task_id).first()
        if not task:
            return HTTPNotFound(json_body={'error': 'Task not found'})

        data = request.json_body

        if 'title' in data:
            task.title = data['title']

        if 'category_id' in data:
            category_id = data['category_id']
            if category_id is not None:
                category = DBSession.query(Category).get(category_id)
                if not category:
                    return HTTPBadRequest(json_body={'error': 'Category not found'})
                task.category = category
            else:
                task.category = None  # hapus kategori jika dikosongkan

        DBSession.flush()

        return {
            "id": task.id,
            "title": task.title,
            "category": {
                "id": task.category.id,
                "name": task.category.name,
            } if task.category else None
        }
    except Exception as e:
        log.error(f"Error updating task: {e}", exc_info=True)
        request.response.status = 500
        return {"error": str(e)}

@view_config(route_name='task_by_id', request_method='DELETE', renderer='json')
def delete_task(request):
    try:
        task_id = request.matchdict.get('id')
        task = DBSession.query(Task).filter(Task.id == task_id).first()
        if not task:
            return HTTPNotFound(json_body={'error': 'Task not found'})

        DBSession.delete(task)
        DBSession.flush()

        return {"message": "Task deleted"}
    except Exception as e:
        log.error(f"Error deleting task: {e}", exc_info=True)
        request.response.status = 500
        return {"error": str(e)}

@view_config(route_name='categories', request_method='GET', renderer='json')
def categories_view(request):
    try:
        categories = DBSession.query(Category).all()
        return [{"id": c.id, "name": c.name} for c in categories]
    except Exception as e:
        log.error(f"Error fetching categories: {e}", exc_info=True)
        request.response.status = 500
        return {"error": "Internal server error"}

@view_config(route_name='categories', request_method='POST', renderer='json')
def add_category(request):
    try:
        data = request.json_body
        name = data.get('name')
        if not name:
            return HTTPBadRequest(json_body={'error': 'Name is required'})

        existing = DBSession.query(Category).filter(Category.name == name).first()
        if existing:
            return HTTPBadRequest(json_body={'error': 'Category already exists'})

        category = Category(name=name)
        DBSession.add(category)
        DBSession.flush()

        return {"id": category.id, "name": category.name}
    except Exception as e:
        log.error(f"Error adding category: {e}", exc_info=True)
        request.response.status = 500
        return {"error": str(e)}

@view_config(route_name='category_by_id', request_method='DELETE', renderer='json')
def delete_category(request):
    try:
        category_id = request.matchdict.get('id')
        category = DBSession.query(Category).filter(Category.id == category_id).first()
        if not category:
            return HTTPNotFound(json_body={'error': 'Category not found'})

        DBSession.delete(category)
        DBSession.flush()

        return {"message": "Category deleted"}
    except Exception as e:
        log.error(f"Error deleting category: {e}", exc_info=True)
        request.response.status = 500
        return {"error": str(e)}

@view_config(route_name='users', renderer='json')
def users_view(request):
    try:
        users = DBSession.query(User).all()
        return [{"id": u.id, "username": u.username, "email": u.email} for u in users]
    except Exception as e:
        log.error(f"Error fetching users: {e}", exc_info=True)
        request.response.status = 500
        return {"error": "Internal server error"}