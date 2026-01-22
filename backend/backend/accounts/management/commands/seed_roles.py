import uuid
from django.core.management.base import BaseCommand
from django.utils import timezone
from accounts.models import Master_Role  # ✅ update 'your_app' to your actual app name


class Command(BaseCommand):
    help = "Seeds initial roles (user and admin) into Master_Role table"

    def handle(self, *args, **options):
        roles_data = [
            {
                "role_name": "user",
                "form_ids": "F_dashboard_001",
                "process_ids": "P_panel_001,P_panel_002",
            },
            {
                "role_name": "admin",
                "form_ids": "F_dashboard_001",
                "process_ids": "P_panel_001,P_panel_002,P_panel_003,P_panel_004,P_panel_005,P_panel_006,P_panel_007,P_panel_008",
            },
        ]

        for role_data in roles_data:
            role, created = Master_Role.objects.get_or_create(
                role_name=role_data["role_name"],
                defaults={
                    "id": uuid.uuid4(),
                    "form_ids": role_data["form_ids"],
                    "process_ids": role_data["process_ids"],
                    "created_by": None,
                    "created_at": timezone.now(),
                    "is_active": True,
                    "is_deleted": False,
                },
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"✅ Created role: {role.role_name}"))
            else:
                self.stdout.write(self.style.WARNING(f"⚠️ Role already exists: {role.role_name}"))

        self.stdout.write(self.style.SUCCESS("🎉 Role seeding completed successfully!"))
