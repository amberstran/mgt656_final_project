from django.db import migrations


def ensure_avatar(apps, schema_editor):
    vendor = schema_editor.connection.vendor
    with schema_editor.connection.cursor() as cursor:
        if vendor == 'sqlite':
            cursor.execute("PRAGMA table_info('core_customuser');")
            cols = [row[1] for row in cursor.fetchall()]
            if 'avatar' not in cols:
                cursor.execute("ALTER TABLE core_customuser ADD COLUMN avatar varchar(200);")
        else:
            try:
                cursor.execute("ALTER TABLE core_customuser ADD COLUMN IF NOT EXISTS avatar varchar(200);")
            except Exception:
                # Best-effort: ignore if DB doesn't support IF NOT EXISTS
                pass


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0007_fix_missing_columns"),
    ]

    operations = [
        migrations.RunPython(ensure_avatar, reverse_code=migrations.RunPython.noop)
    ]
