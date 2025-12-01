# Generated manually on 2025-11-30
from django.db import migrations


def create_initial_circles(apps, schema_editor):
    Circle = apps.get_model('core', 'Circle')
    circles_data = [
        {'name': 'Yale Hiking Club', 'description': 'For hiking enthusiasts around Yale and New Haven.'},
        {'name': 'Yale Chess Circle', 'description': 'Casual and competitive chess meetups for all skill levels.'},
        {'name': 'Data Science Society', 'description': 'Talks, projects, and learning opportunities in data science and ML.'},
        {'name': 'Yale Book Club', 'description': 'Monthly book discussions and literary events.'},
        {'name': 'Bulldog Runners', 'description': 'Running group for casual joggers and marathon trainers.'},
    ]
    for data in circles_data:
        Circle.objects.get_or_create(name=data['name'], defaults={'description': data['description']})


def remove_initial_circles(apps, schema_editor):
    Circle = apps.get_model('core', 'Circle')
    Circle.objects.filter(name__in=[
        'Yale Hiking Club',
        'Yale Chess Circle',
        'Data Science Society',
        'Yale Book Club',
        'Bulldog Runners',
    ]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_comment_parent'),
    ]

    operations = [
        migrations.RunPython(create_initial_circles, reverse_code=remove_initial_circles),
    ]
