from __future__ import annotations

import time

from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

REQUEST_COUNT = Counter(
    "equiaudit_http_requests_total",
    "Total HTTP requests",
    ["method", "path"],
)
REQUEST_LATENCY = Histogram(
    "equiaudit_http_request_duration_seconds",
    "HTTP request duration in seconds",
    ["method", "path"],
)
RESPONSE_COUNT = Counter(
    "equiaudit_http_responses_total",
    "Total HTTP responses",
    ["method", "path", "status"],
)


class MetricsMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start = time.monotonic()
        response = await call_next(request)
        duration = time.monotonic() - start

        path = request.url.path
        REQUEST_COUNT.labels(request.method, path).inc()
        REQUEST_LATENCY.labels(request.method, path).observe(duration)
        RESPONSE_COUNT.labels(request.method, path, str(response.status_code)).inc()
        return response


def metrics_response() -> Response:
    payload = generate_latest()
    return Response(payload, media_type=CONTENT_TYPE_LATEST)
