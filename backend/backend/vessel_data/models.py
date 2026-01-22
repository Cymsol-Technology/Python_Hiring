from django.db import models
import uuid
from django.utils import timezone
from masters.models import Master_Vessels, Master_hscode


class Vessel_Data(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    hire_rate = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    market_rate = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    market_date = models.DateField()
    vessel = models.ForeignKey(Master_Vessels, on_delete=models.CASCADE)
    hscode = models.ForeignKey(
        Master_hscode,
        on_delete=models.CASCADE,
        db_column='hscode' 
    )
    created_by = models.UUIDField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.UUIDField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        db_table = 'market_rate'