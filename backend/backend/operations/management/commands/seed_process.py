import uuid
from django.core.management.base import BaseCommand
from django.utils import timezone
from your_app.models import Process


class Command(BaseCommand):
    help = "Populate the Process model with default process codes and names."

    def handle(self, *args, **options):
        processes = [
            {"process_code": "FILTER_SECTION", "process_name": "FILTER_SECTION"},
            {"process_code": "CREATE_VESSEL_DATA", "process_name": "CREATE_VESSEL_DATA"},
            {"process_code": "VESSEL_CHART", "process_name": "VESSEL_CHART"},
            {"process_code": "DATA_TABLE", "process_name": "DATA_TABLE"},
            {"process_code": "AGGREGATE_TAB", "process_name": "AGGREGATE_TAB"},
            {"process_code": "AGGREGATE_CHART", "process_name": "AGGREGATE_CHART"},
        ]

        created_count = 0
        for p in processes:
            obj, created = Process.objects.get_or_create(
                process_code=p["process_code"],
                defaults={
                    "process_name": p["process_name"],
                    "created_at": timezone.now(),
                    "is_active": True,
                    "is_deleted": False,
                },
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f"✅ Created: {obj.process_name}"))
            else:
                self.stdout.write(self.style.WARNING(f"⚠️ Already exists: {obj.process_name}"))

        self.stdout.write(
            self.style.SUCCESS(f"\n🎉 Process population completed. {created_count} new entries created.")
        )
