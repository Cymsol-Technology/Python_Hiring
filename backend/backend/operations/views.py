import json
from django.http import JsonResponse
from django.views import View
from django.db.models import Prefetch
from accounts.models import Master_Role, Mapping_User_Role, User
from operations.models import profile_mapping


class get_role_access(View):
    """
    Returns a list of user-role-profile mappings with:
    role_id, role_name, user_id, user_name, profile_id, profile_name, form_id, process_id
    """

    def get(self, request):
        # Get all user-role mappings with related role and user
        mappings = (
            Mapping_User_Role.objects
            .select_related("role", "user")  # optimize queries
            .filter(is_deleted=False, is_active=True)
        )

        data = []

        for mapping in mappings:
            # Get related profiles for the same role (if any)
            profiles = profile_mapping.objects.filter(
                role=mapping.role,
                is_deleted=False,
                is_active=True
            )

            # If there are no profiles, still return role-user pair
            if not profiles.exists():
                data.append({
                    "role_id": str(mapping.role.id),
                    "role_name": mapping.role.role_name,
                    "user_id": str(mapping.user.id),
                    "user_name": mapping.user.user_name,
                    "profile_id": None,
                    "profile_name": None,
                    "form_id": None,
                    "process_id": None,
                })
            else:
                # Add entries for each profile under that role
                for profile in profiles:
                    data.append({
                        "role_id": str(mapping.role.id),
                        "role_name": mapping.role.role_name,
                        "user_id": str(mapping.user.id),
                        "user_name": mapping.user.user_name,
                        "profile_id": str(profile.id),
                        "profile_name": profile.profile_name,
                        "form_id": profile.form_id,
                        "process_id": profile.process_id,
                    })

        return JsonResponse({"data": data}, safe=False)
