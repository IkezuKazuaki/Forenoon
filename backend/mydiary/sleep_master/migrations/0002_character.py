# Generated by Django 5.1.2 on 2024-11-18 10:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sleep_master', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Character',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
                ('description', models.TextField(blank=True)),
                ('icon', models.URLField(blank=True)),
            ],
        ),
    ]
