import logging
from pyramid.httpexceptions import HTTPException

logger = logging.getLogger(__name__)

def http_exception_view(exc, request):
    """Handle HTTP exceptions"""
    logger.warning(f"HTTP Exception: {exc.status_code} - {exc.detail}")
    
    request.response.status_code = exc.status_code
    return {
        'error': exc.detail or exc.title,
        'status_code': exc.status_code
    }

def general_exception_view(exc, request):
    """Handle general exceptions"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    
    request.response.status_code = 500
    return {
        'error': 'Internal server error',
        'status_code': 500
    }

def setup_error_handlers(config):
    """Setup error handlers"""
    config.add_view(
        http_exception_view,
        context=HTTPException,
        renderer='json'
    )
    config.add_view(
        general_exception_view,
        context=Exception,
        renderer='json'
    )
