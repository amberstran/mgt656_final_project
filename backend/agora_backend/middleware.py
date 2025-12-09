import logging
import traceback

from django.http import JsonResponse

logger = logging.getLogger(__name__)

class ExceptionLoggingMiddleware:
    """Middleware to log unhandled exceptions with request path.

    In production (DEBUG=False) Django hides tracebacks from responses; this
    captures them in logs so Render dashboard can display them. For JSON/API
    requests (Accept header contains application/json) it returns a minimal
    error payload without leaking stack details to the client.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            return self.get_response(request)
        except Exception as exc:  # noqa: BLE001
            tb = traceback.format_exc()
            logger.error("[exception] path=%s error=%s\n%s", request.path, exc, tb)
            if 'application/json' in request.headers.get('Accept', ''):
                return JsonResponse({'error': 'server_error', 'detail': 'Internal error'}, status=500)
            raise
