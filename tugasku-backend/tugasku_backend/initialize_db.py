from tugasku_backend.database import Base, engine
from tugasku_backend.models import User, Task, Category

def init_db():
    Base.metadata.create_all(bind=engine)

if __name__ == '__main__':
    init_db()
    print("Database dan tabel berhasil dibuat")