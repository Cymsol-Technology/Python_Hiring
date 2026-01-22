from django.core.management.base import BaseCommand
from django.utils import timezone
from masters.models import Master_Vessels
import uuid

class Command(BaseCommand):
    help = "Populates the Master_Vessels table with initial vessel data."

    def handle(self, *args, **options):
        vessels_data = [
            {"vessel_name": "EAST AYUTTHAYA", "vessel_code": "EAT", "imo_number": "9584293"},
            {"vessel_name": "EAST BANGKOK", "vessel_code": "EBK", "imo_number": "9659490"},
            {"vessel_name": "SF CHALISA", "vessel_code": "SFC", "imo_number": "9502726"},
            {"vessel_name": "SF DARIKA", "vessel_code": "SFD", "imo_number": "9502752"},
            {"vessel_name": "SFYC ARAYA", "vessel_code": "ARY", "imo_number": "9487043"},
            {"vessel_name": "YC FORTITUDE", "vessel_code": "YCF", "imo_number": "9587178"},
        ]

        for data in vessels_data:
            vessel, created = Master_Vessels.objects.get_or_create(
                vessel_name=data["vessel_name"],
                defaults={
                    "id": uuid.uuid4(),
                    "vessel_code": data["vessel_code"],
                    "imo_number": data["imo_number"],
                    "dead_weight": 32,
                    "created_at": timezone.now(),
                    "is_active": True,
                    "is_deleted": False,
                },
            )

            if created:
                self.stdout.write(self.style.SUCCESS(f"✅ Created vessel: {data['vessel_name']}"))
            else:
                self.stdout.write(self.style.WARNING(f"⚠️ Vessel already exists: {data['vessel_name']}"))

        self.stdout.write(self.style.SUCCESS("🎉 Vessel data population complete."))
