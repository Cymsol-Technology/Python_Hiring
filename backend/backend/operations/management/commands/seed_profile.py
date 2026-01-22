from django.core.management.base import BaseCommand
from django.db import transaction
from accounts.models import  Master_Role  
from operations.models import profile_mapping

class Command(BaseCommand):
    help = "Populate profile_mapping table with admin role access for DASHBOARD (VIEW_CHART, FILTER)"

    def handle(self, *args, **options):
        try:
            # Fetch the 'admin' role
            try:
                admin_role = Master_Role.objects.get(role_name="admin", is_active=True, is_deleted=False)
            except Master_Role.DoesNotExist:
                self.stdout.write(self.style.ERROR("❌ 'admin' role not found in Master_Role table."))
                return

            mappings_to_add = [
                {
                    "profile_name": "admin",
                    "form_id": "DASHBOARD",
                    "process_id": "VIEW_CHART",
                },
                {
                    "profile_name": "admin",
                    "form_id": "DASHBOARD",
                    "process_id": "FILTER",
                },
                 {
                    "profile_name": "admin",
                    "form_id": "DASHBOARD",
                    "process_id": "VIEW_AGGREGATE",
                },
                {
                    "profile_name": "admin",
                    "form_id": "DASHBOARD",
                    "process_id": "AGGREGATE_FILTER",
                },
                 {
                    "profile_name": "admin",
                    "form_id": "DASHBOARD",
                    "process_id": "VIEW_TABLE",
                },
                {
                    "profile_name": "admin",
                    "form_id": "DASHBOARD",
                    "process_id": "CREATE_VESSEL_DATA",
                },
                 {
                    "profile_name": "admin",
                    "form_id": "DASHBOARD",
                    "process_id": "TAB_NAVIGATION",
                },
                
            ]

            created_count = 0
            with transaction.atomic():
                for mapping in mappings_to_add:
                    exists = profile_mapping.objects.filter(
                        role=admin_role,
                        form_id=mapping["form_id"],
                        process_id=mapping["process_id"],
                        is_deleted=False,
                    ).exists()

                    if not exists:
                        profile_mapping.objects.create(
                            profile_name=mapping["profile_name"],
                            role=admin_role,
                            form_id=mapping["form_id"],
                            process_id=mapping["process_id"],
                            created_by=None,
                        )
                        created_count += 1
                        self.stdout.write(
                            self.style.SUCCESS(
                                f"✅ Added mapping: {mapping['form_id']} -> {mapping['process_id']}"
                            )
                        )
                    else:
                        self.stdout.write(
                            self.style.WARNING(
                                f"⚠️ Mapping already exists: {mapping['form_id']} -> {mapping['process_id']}"
                            )
                        )

            self.stdout.write(
                self.style.SUCCESS(f"🎯 Successfully populated {created_count} new profile_mapping entries.")
            )

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Error populating profile_mapping: {str(e)}"))
