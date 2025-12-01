from django.db import migrations


def create_initial_circles(apps, schema_editor):
    Circle = apps.get_model('core', 'Circle')
    circles = [
        {'name': 'Yale Hiking Club', 'description': 'For hiking enthusiasts around Yale.'},
        {'name': 'Yale Chess Circle', 'description': 'Casual and competitive chess meetups.'},
        {'name': 'Data Science Society', 'description': 'Talks, projects, and learning in data science.'},
    ]
    for c in circles:
        Circle.objects.get_or_create(name=c['name'], defaults={'description': c['description']})


def remove_initial_circles(apps, schema_editor):
    Circle = apps.get_model('core', 'Circle')
    Circle.objects.filter(name__in=[
        'Yale Hiking Club',
        'Yale Chess Circle',
        'Data Science Society'
    ]).delete()


class Migration(migrations.Migration):
    dependencies = [
        ('core', '0002_comment_parent'),
    ]

    operations = [
        migrations.RunPython(create_initial_circles, reverse_code=remove_initial_circles),
    ]
