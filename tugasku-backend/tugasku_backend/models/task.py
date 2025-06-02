from sqlalchemy import Column, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .base import BaseModel

class Task(BaseModel):
    __tablename__ = 'tasks'

    title = Column(String(255), nullable=False)
    description = Column(Text)
    status = Column(String(50), default='pending')  # pending, in_progress, completed
    priority = Column(String(20), default='medium')  # low, medium, high
    due_date = Column(DateTime)
    
    # Foreign Keys
    user_id = Column(ForeignKey('users.id'), nullable=False)
    category_id = Column(ForeignKey('categories.id'), nullable=True)

    # Relationships
    user = relationship('User', back_populates='tasks')
    category = relationship('Category', back_populates='tasks')
    logs = relationship('TaskLog', back_populates='task', cascade='all, delete-orphan')

    def to_dict(self) -> dict:
        """Convert to dictionary"""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'priority': self.priority,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'user': self.user.to_dict() if self.user else None,
            'category': self.category.to_dict() if self.category else None
        }
