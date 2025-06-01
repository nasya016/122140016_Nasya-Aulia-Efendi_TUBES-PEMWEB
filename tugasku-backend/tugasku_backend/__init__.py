from pyramid.config import Configurator
from sqlalchemy import engine_from_config
from pyramid.events import NewResponse
from .database import DBSession, Base

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application."""
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    Base.metadata.bind = engine

    config = Configurator(settings=settings)
    config.include('pyramid_jinja2')

    # Tambah header CORS manual pakai NewResponse event
    config.add_subscriber(
        lambda event: event.response.headers.extend({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }),
        NewResponse
    )

    # Daftarkan routes
    config.add_route('home', '/')
    config.add_route('tasks', '/tasks')
    config.add_route('task_by_id', '/tasks/{id}')
    config.add_route('categories', '/categories')
    config.add_route('category_by_id', '/categories/{id}')
    config.add_route('users', '/users')

    config.scan()
    return config.make_wsgi_app()