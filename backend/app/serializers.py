from rest_framework import serializers
from .models import Person


class PersonSerializer(serializers.ModelSerializer):
    """
    Serializer ensures data types and validation.
    """
    class Meta:
        model = Person
        fields = "__all__"
        read_only_fields = ("id", "created_date", "modified_date")


class StatisticsRequestSerializer(serializers.Serializer):
    """
    Serializer for statistics calculation request.
    """
    values = serializers.ListField(
        child=serializers.FloatField(),
        help_text="List of numeric values to calculate statistics",
        min_length=1
    )


class StatisticsResponseSerializer(serializers.Serializer):
    """
    Serializer for statistics task response.
    """
    task_id = serializers.UUIDField(help_text="Celery task ID")
    status = serializers.CharField(help_text="Task status")
    values_count = serializers.IntegerField(help_text="Number of values submitted")