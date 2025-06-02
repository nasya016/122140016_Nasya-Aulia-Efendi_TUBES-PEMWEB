from typing import Dict, Any
from sqlalchemy.orm import Query
from ..config import get_config

config = get_config()

def paginate(query: Query, page: int = 1, page_size: int = None) -> Dict[str, Any]:
    """Paginate query results"""
    if page_size is None:
        page_size = config.DEFAULT_PAGE_SIZE
    
    # Ensure page_size doesn't exceed maximum
    page_size = min(page_size, config.MAX_PAGE_SIZE)
    
    # Ensure page is at least 1
    page = max(page, 1)
    
    # Get total count
    total = query.count()
    
    # Calculate total pages
    pages = (total + page_size - 1) // page_size
    
    # Get items for current page
    offset = (page - 1) * page_size
    items = query.offset(offset).limit(page_size).all()
    
    return {
        'items': items,
        'page': page,
        'page_size': page_size,
        'total': total,
        'pages': pages,
        'has_next': page < pages,
        'has_prev': page > 1
    }
