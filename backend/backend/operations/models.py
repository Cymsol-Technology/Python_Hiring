# from django.db import models
# import uuid
# from django.utils import timezone

# from accounts.models import Master_Role


# class Forms(models.Model):
#     id = models.CharField(max_length=50, primary_key=True) 
#     form_name = models.CharField(max_length=150, unique=True)
#     created_by = models.CharField(max_length=50, null=True, blank=True)
#     created_at = models.DateTimeField(default=timezone.now)
#     updated_by = models.CharField(max_length=50, null=True, blank=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     is_active = models.BooleanField(default=True)
#     is_deleted = models.BooleanField(default=False)

#     class Meta:
#         db_table = 'forms'


# class Process(models.Model):
#     id = models.CharField(max_length=50, primary_key=True)  # custom string ID
#     process_name = models.CharField(max_length=150, unique=True)
#     created_by = models.CharField(max_length=50, null=True, blank=True)
#     created_at = models.DateTimeField(default=timezone.now)
#     updated_by = models.CharField(max_length=50, null=True, blank=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     is_active = models.BooleanField(default=True)
#     is_deleted = models.BooleanField(default=False)

#     class Meta:
#         db_table = 'process'



# class profile_mapping(models.Model):
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     profile_name = models.CharField(max_length=150)
#     role = models.ForeignKey(Master_Role, on_delete=models.CASCADE)
#     form_id = models.CharField(max_length=150, null=True, blank=True)
#     process_id = models.CharField(max_length=150, null=True, blank=True)
#     created_by = models.UUIDField(null=True, blank=True)
#     created_at = models.DateTimeField(default=timezone.now)
#     updated_by = models.UUIDField(null=True, blank=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     is_active = models.BooleanField(default=True)
#     is_deleted = models.BooleanField(default=False)

#     class Meta:
#         db_table = 'profile_mapping'
  

         



          





