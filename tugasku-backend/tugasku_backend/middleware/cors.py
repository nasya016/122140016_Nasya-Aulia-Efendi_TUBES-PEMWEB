from pyramid.events import NewResponse
from pyramid.response import Response

def add_cors_headers(event):
    """Add CORS headers to response"""
    response = event.response
    request = event.request
    
    # Get origin from request or use wildcard
    origin = request.headers.get('Origin', '*')
    
    response.headers.update({
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400'
    })

def handle_options_request(request):
    """Handle OPTIONS requests for CORS preflight"""
    response = Response()
    response.headers.update({
        'Access-Control-Allow-Origin': request.headers.get('Origin', '*'),
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400'
    })
    return response

def setup_cors(config):
    """Setup CORS configuration"""
    # Add CORS headers to all responses
    config.add_subscriber(add_cors_headers, NewResponse)
    
    # Add a catch-all OPTIONS view
    config.add_route('cors_preflight_handler', '/{catch_all:.*}', request_method='OPTIONS')
    config.add_view(handle_options_request, route_name='cors_preflight_handler')
