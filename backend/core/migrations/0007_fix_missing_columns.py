from django.db import migrations, connection


def ensure_columns(apps, schema_editor):
    """Add missing columns in a DB-agnostic way.

    For Postgres we can use IF NOT EXISTS. For SQLite we check pragma info
    then ALTER TABLE ADD COLUMN if missing.
    """
    vendor = schema_editor.connection.vendor

    if vendor == 'postgresql':
        with schema_editor.connection.cursor() as cursor:
            cursor.execute("ALTER TABLE core_customuser ADD COLUMN IF NOT EXISTS bio TEXT;")
            cursor.execute("ALTER TABLE core_post ADD COLUMN IF NOT EXISTS image TEXT;")
    elif vendor == 'sqlite':
        # SQLite doesn't support IF NOT EXISTS on ALTER TABLE, so inspect schema
        with schema_editor.connection.cursor() as cursor:
            cursor.execute("PRAGMA table_info('core_customuser');")
            cols = [row[1] for row in cursor.fetchall()]
            if 'bio' not in cols:
                cursor.execute("ALTER TABLE core_customuser ADD COLUMN bio TEXT;")

            cursor.execute("PRAGMA table_info('core_post');")
            cols = [row[1] for row in cursor.fetchall()]
            if 'image' not in cols:
                cursor.execute("ALTER TABLE core_post ADD COLUMN image TEXT;")
    else:
        # Fallback: attempt the IF NOT EXISTS style and let the DB raise if unsupported
        with schema_editor.connection.cursor() as cursor:
            try:
                cursor.execute("ALTER TABLE core_customuser ADD COLUMN IF NOT EXISTS bio TEXT;")
            except Exception:
                pass
            try:
                cursor.execute("ALTER TABLE core_post ADD COLUMN IF NOT EXISTS image TEXT;")
            except Exception:
                pass


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0006_message_report_circlemembership"),
    ]

    operations = [
        migrations.RunPython(ensure_columns, reverse_code=migrations.RunPython.noop)
    ]
