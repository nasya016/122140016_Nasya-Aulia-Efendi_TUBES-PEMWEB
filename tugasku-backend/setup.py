from setuptools import setup, find_packages

requires = [
    'pyramid>=2.0.2',
    'pyramid_jinja2>=2.10',
    'waitress>=2.1.2',
    'SQLAlchemy>=2.0.23',
    'psycopg2-binary>=2.9.9',
    'bcrypt>=4.1.2',
    'PyJWT>=2.8.0',
    'alembic>=1.13.1',
]

tests_require = [
    'pytest>=7.4.3',
    'pytest-cov>=4.1.0',
    'webtest>=3.0.0',
]

setup(
    name='tugasku-backend',
    version='1.0.0',
    description='TugasKu Task Management Backend API',
    long_description='A modern task management backend built with Python Pyramid',
    classifiers=[
        'Programming Language :: Python',
        'Framework :: Pyramid',
        'Topic :: Internet :: WWW/HTTP',
        'Topic :: Internet :: WWW/HTTP :: WSGI :: Application',
    ],
    author='TugasKu Team',
    author_email='team@tugasku.com',
    url='https://github.com/tugasku/tugasku-backend',
    keywords='web pyramid pylons task management api',
    packages=find_packages(include=['tugasku_backend', 'tugasku_backend.*']),
    include_package_data=True,
    zip_safe=False,
    extras_require={
        'testing': tests_require,
    },
    install_requires=requires,
    entry_points={
        'paste.app_factory': [
            'main = tugasku_backend:main',
        ],
    },
)
