from django.core.management.base import BaseCommand
from django.utils import timezone
from masters.models import Master_hscode
import uuid

class Command(BaseCommand):
    help = "Populates the Master_hscode table with predefined HS code data."

    def handle(self, *args, **options):
        hscode_data = [
            {"code": "HS1", "description": "Skaw-Passero trip to Rio de Janeiro-Recalada"},
            {"code": "HS2", "description": "Skaw-Passero trip to Boston-Galveston"},
            {"code": "HS3", "description": "Rio de Janeiro-Recalada trip to Skaw-Passero"},
            {"code": "HS4", "description": "US Gulf trip via US Gulf or north coast South America to Skaw-Passero"},
            {"code": "HS5", "description": "South East Asia trip to Singapore-Japan"},
            {"code": "HS6", "description": "North China-South Korea-Japan trip to North China-South Korea-Japan"},
            {"code": "HS7", "description": "North China-South Korea-Japan trip to south east Asia"},
        ]

        for data in hscode_data:
            hscode, created = Master_hscode.objects.get_or_create(
                code=data["code"],
                defaults={
                    "id": uuid.uuid4(),
                    "description": data["description"],
                    "created_at": timezone.now(),
                    "is_active": True,
                    "is_deleted": False,
                },
            )

            if created:
                self.stdout.write(self.style.SUCCESS(f"✅ Created HS code: {data['code']}"))
            else:
                self.stdout.write(self.style.WARNING(f"⚠️ HS code already exists: {data['code']}"))

        self.stdout.write(self.style.SUCCESS("🎉 HS code data population complete."))
