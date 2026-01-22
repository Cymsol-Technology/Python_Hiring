from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction,IntegrityError
import uuid, jwt
from django.conf import settings
from django.utils import timezone
from .models import User, Master_Role, Mapping_User_Role
import json



@csrf_exempt
def create_admin(request):
   
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)

  
    if User.objects.filter(user_name="admin", is_deleted=False).exists():
        return JsonResponse({"message": "Admin already exists"}, status=400)

   
    admin_data = {
        "user_name": "admin",
        "email": "admin@example.com",
        "mobile_no": "9999999999",
        "password": "admin123"
    }

    try:
        with transaction.atomic():
            # Create admin user
            admin = User.objects.create(
                user_name=admin_data["user_name"],
                email=admin_data["email"],
                mobile_no=admin_data["mobile_no"],
                password=admin_data["password"],  # Plain text for now (we will hash later)
                is_active=True,
                is_deleted=False,
                created_by=None
            )

            # Assign role
            admin_role = Master_Role.objects.get(role_name="admin")
            Mapping_User_Role.objects.create(
                user=admin,
                role=admin_role,
                created_by=None
            )

        return JsonResponse({"message": "Admin created successfully"}, status=201)
    
    except Master_Role.DoesNotExist:
        return JsonResponse({"error": "Admin role not found. Insert it first in Master_Role table."}, status=500)
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)





@csrf_exempt
def register(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "Invalid request method"}, status=405)

   
    try:
        data = json.loads(request.body.decode("utf-8"))
    except Exception as e:
        return JsonResponse({"success": False, "message": "Invalid JSON format"}, status=400)

    user_name = data.get("user_name")
    email = data.get("email")
    mobile_no = data.get("mobile_no")
    password = data.get("password")

   
    if not user_name:
        return JsonResponse({"success": False, "message": "User name is required"}, status=400)

    if not email:
        return JsonResponse({"success": False, "message": "Email is required"}, status=400)

    if not mobile_no:
        return JsonResponse({"success": False, "message": "Mobile number is required"}, status=400)

    if not password:
        return JsonResponse({"success": False, "message": "Password is required"}, status=400)

    #  Check if email exists
    if User.objects.filter(email=email).exists():
        return JsonResponse({"success": False, "message": "Email already exists"}, status=409)

    #  Check if username exists
    if User.objects.filter(user_name=user_name).exists():
        return JsonResponse({"success": False, "message": "Username already exists"}, status=409)

    try:
        with transaction.atomic():

            #  Create User
            user = User.objects.create(
                user_name=user_name,
                email=email,
                mobile_no=mobile_no,
                password=password,  # plain text as requested
                created_by=None,
                is_active=True,
                is_deleted=False
            )

            #  Fetch default role
            try:
                user_role = Master_Role.objects.get(role_name="user")
            except Master_Role.DoesNotExist:
                return JsonResponse({"success": False, "message": "Default role 'user' not found"}, status=500)

            #  Insert into mapping table
            Mapping_User_Role.objects.create(
                user=user,
                role=user_role,
                created_by=None
            )

        return JsonResponse({"success": True, "message": "User registered successfully"}, status=201)

    except IntegrityError as e:
        return JsonResponse({"success": False, "message": "Database error", "details": str(e)}, status=500)
    except Exception as e:  # catch all errors
        return JsonResponse({"success": False, "message": "Something went wrong", "details": str(e)}, status=500)



from django.db.models import Q

@csrf_exempt
def login(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method. Only POST allowed."}, status=405)

    #  Parse JSON Input
    try:
        data = json.loads(request.body.decode())
    except Exception:
        return JsonResponse({"error": "Invalid JSON format"}, status=400)

    identifier = data.get("email") or data.get("user_name")  # ✅ Accept either email or username
    password = data.get("password")

    #  Validate Inputs
    if not identifier or not password:
        return JsonResponse({"error": "Email/Username and Password are required"}, status=400)

    #  Fetch User (email or user_name)
    try:
        user = User.objects.get(
            Q(email=identifier) | Q(user_name=identifier),
            password=password,
            is_active=True,
            is_deleted=False
        )
    except User.DoesNotExist:
        return JsonResponse({"error": "Invalid email/username or password"}, status=401)
    except Exception as e:
        return JsonResponse({"error": f"Unexpected database error: {str(e)}"}, status=500)

    #  Fetch Role safely
    try:
        user_role_obj = Mapping_User_Role.objects.get(user=user, is_active=True, is_deleted=False)
        role = user_role_obj.role.role_name
        form_ids = (
            [x.strip() for x in user_role_obj.role.form_ids.split(",")] 
            if user_role_obj.role.form_ids 
            else []
        )
        process_ids = (
            [x.strip() for x in user_role_obj.role.process_ids.split(",")] 
            if user_role_obj.role.process_ids 
            else []
        )
    except Mapping_User_Role.DoesNotExist:
        return JsonResponse({"error": "User has no role assigned. Contact admin."}, status=403)
    except Exception as e:
        return JsonResponse({"error": f"Role fetching error: {str(e)}"}, status=500)

    #  JWT Expiry
    exp_time = timezone.now() + timezone.timedelta(seconds=settings.JWT_EXP_SECONDS)

    payload = {
        "user_id": str(user.id),
        "role": role,
        "exp": int(exp_time.timestamp()),
        
    }

    try:
        token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    except Exception as e:
        return JsonResponse({"error": f"Token generation failed: {str(e)}"}, status=500)

    return JsonResponse({
        "message": "Login successful",
        "token": token,
        "role": role,
        "username": user.user_name,
        "form_ids": form_ids,
        "process_ids": process_ids,
    }, status=200)




#  Logout
def logout(request):
    return JsonResponse({"message": "Logout successful. Just remove token in frontend."})
