from sqlalchemy import Column, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel

class TaskLog(BaseModel):
    __tablename__ = 'task_logs'

    task_id = Column(ForeignKey('tasks.id'), nullable=False)
    old_status = Column(String(50))
    new_status = Column(String(50), nullable=False)
    changed_by = Column(ForeignKey('users.id'), nullable=False)
    notes = Column(Text)

    # Relationships
    task = relationship('Task', back_populates='logs')
    user = relationship('User')

    def to_dict(self) -> dict:
        """Convert to dictionary"""
        return {
            'id': self.id,
            'task_id': self.task_id,
            'old_status': self.old_status,
            'new_status': self.new_status,
            'changed_by': self.user.username if self.user else None,
            'changed_at': self.created_at.isoformat() if self.created_at else None,
            'notes': self.notes
        }
