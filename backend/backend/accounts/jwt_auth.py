import jwt
from django.conf import settings
from django.http import JsonResponse
from .models import User


def require_jwt(view_func):
    def wrapper(request, *args, **kwargs):
        auth = request.META.get("HTTP_AUTHORIZATION", "")

        if not auth.startswith("Bearer "):
            return JsonResponse({"error": "Token missing"}, status=401)

        token = auth.split("Bearer ")[1]

        try:
            decoded = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        except jwt.ExpiredSignatureError:
            return JsonResponse({"error": "Token expired"}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({"error": "Invalid token"}, status=401)

        # attach user info to request
        try:
            request.user = User.objects.get(id=decoded["user_id"])
            request.role = decoded["role"]
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=401)

        return view_func(request, *args, **kwargs)

    return wrapper
