from pyramid.config import Configurator
from pyramid.view import view_config
from pyramid.response import Response
from sqlalchemy import engine_from_config
from .database.connection import DBSession, Base
from .middleware import setup_cors, setup_error_handlers
from .utils.logging import setup_logging
from .config import get_config

def root_view(request):
    """Root view - API information"""
    return {
        'name': 'TugasKu API',
        'version': '1.0.0',
        'description': 'Task Management API',
        'endpoints': {
            'health': '/api/health',
            'auth': {
                'register': '/api/auth/register',
                'login': '/api/auth/login',
                'profile': '/api/auth/profile'
            },
            'tasks': {
                'list': '/api/tasks',
                'detail': '/api/tasks/{id}'
            },
            'categories': {
                'list': '/api/categories',
                'detail': '/api/categories/{id}'
            },
            'dashboard': '/api/dashboard'
        }
    }

def health_check(request):
    """Health check endpoint"""
    return {'status': 'ok', 'message': 'TugasKu API is running'}

def main(global_config, **settings):
    """This function returns a Pyramid WSGI application."""
    
    # Setup logging
    setup_logging()
    
    # Get configuration
    config_obj = get_config()
    
    # Update settings with config
    settings.update({
        'sqlalchemy.url': config_obj.SQLALCHEMY_URL,
        'sqlalchemy.echo': config_obj.SQLALCHEMY_ECHO,
    })
    
    # Setup database
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    Base.metadata.bind = engine
    
    # Create Pyramid configuration
    config = Configurator(settings=settings)
    config.include('pyramid_jinja2')
    
    # Setup middleware
    setup_cors(config)
    setup_error_handlers(config)
    
    # Root route
    config.add_route('root', '/')
    config.add_view(root_view, route_name='root', renderer='json')
    
    # API documentation route
    config.add_route('api_docs', '/api')
    config.add_view(root_view, route_name='api_docs', renderer='json')
    
    # Health check route
    config.add_route('health', '/api/health')
    config.add_view(health_check, route_name='health', renderer='json')
    
    # Include views
    config.include('.views')
    
    return config.make_wsgi_app()
