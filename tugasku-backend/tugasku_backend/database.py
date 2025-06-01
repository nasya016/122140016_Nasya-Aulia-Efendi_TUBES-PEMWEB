from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# onnection string postgreSQL-mu
DATABASE_URL = "postgresql+psycopg2://postgres:1812nasya@localhost:5432/tugasku_db"

# Buat engine
engine = create_engine(DATABASE_URL, echo=True)

# Buat session
DBSession = scoped_session(sessionmaker(bind=engine))

# Base class untuk model
Base = declarative_base()

def init_db():
    import tugasku_backend.models  # Import models agar dikenali metadata-nya
    Base.metadata.create_all(bind=engine)