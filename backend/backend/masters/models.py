from django.db import models
import uuid
from django.utils import timezone
from accounts.models import  Master_Role



class Master_Menu(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    menu_name = models.CharField(max_length=100, unique=True)
    menu_path = models.CharField(max_length=255, unique=True)
    menu_icon = models.CharField(max_length=100, null=True, blank=True)
    parent_id = models.UUIDField(null=True, blank=True)
    created_by = models.UUIDField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.UUIDField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        db_table = 'master_menu'     


class Master_Vessels(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vessel_name = models.CharField(max_length=150, unique=True)
    vessel_code = models.CharField(max_length=50, unique=True, null=True)
    imo_number = models.CharField(max_length=50, unique=True)
    dead_weight = models.IntegerField(default=32)
    created_by = models.UUIDField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.UUIDField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        db_table = 'master_vessels'



class Master_hscode(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField(null=True, blank=True)   
    created_by = models.UUIDField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.UUIDField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        db_table = 'master_hscode'                 



          
class Mapping_Role_Menu(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.ForeignKey(Master_Role, on_delete=models.CASCADE)
    menu = models.ForeignKey(Master_Menu, on_delete=models.CASCADE)
    created_by = models.UUIDField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.UUIDField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        db_table = 'mapping_role_menu'