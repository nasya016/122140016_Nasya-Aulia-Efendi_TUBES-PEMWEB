from setuptools import setup, find_packages

requires = [
    'pyramid',
    'pyramid_jinja2',
    'waitress',
    'SQLAlchemy',
    'psycopg2-binary',
]

setup(
    name='tugasku-backend',
    version='0.1',
    packages=find_packages(include=['tugasku_backend', 'tugasku_backend.*']),
    install_requires=requires,
    entry_points={
        'paste.app_factory': [
            'main = tugasku_backend:main',
        ],
    },
)