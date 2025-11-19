"""Generated migration to add post_with_real_name field to CustomUser"""
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0004_post_image"),
    ]

    operations = [
        migrations.AddField(
            model_name="customuser",
            name="post_with_real_name",
            field=models.BooleanField(default=False),
        ),
    ]
