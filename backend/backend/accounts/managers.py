# from django.contrib.auth.models import BaseUserManager

# class UserManager(BaseUserManager):
#     def create_superuser(self, user_name, email, mobile_no, password=None, **extra_fields):
#         if not email:
#             raise ValueError('The Email must be set')
#         email = self.normalize_email(email)
#         user = self.model(
#             user_name=user_name,
#             email=email,
#             mobile_no=mobile_no,
#             **extra_fields
#         )
#         user.password(password)
#         user.is_active = True
#         user.save(using=self._db)

#         from .models import Master_Role, Mapping_User_Role
#         admin_role = Master_Role.objects.get(role_name='admin')
#         Mapping_User_Role.objects.create(user=user, role=admin_role)

#         return user
