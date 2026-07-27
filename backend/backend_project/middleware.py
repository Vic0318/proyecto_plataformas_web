from django.conf import settings
from django.http import HttpResponse

class CORSMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Handle preflight CORS requests
        if request.method == 'OPTIONS':
            response = HttpResponse()
        else:
            response = self.get_response(request)

        # Restrict CORS to configured allowed origins instead of wildcard '*'
        allowed_origins = getattr(settings, 'CORS_ALLOWED_ORIGINS', [])
        origin = request.META.get('HTTP_ORIGIN', '')

        if origin in allowed_origins:
            response['Access-Control-Allow-Origin'] = origin
        elif settings.DEBUG and not allowed_origins:
            # Fallback to allow-all only if no allowed origins configured AND in debug mode
            response['Access-Control-Allow-Origin'] = '*'

        response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
        response['Vary'] = 'Origin'
        return response
