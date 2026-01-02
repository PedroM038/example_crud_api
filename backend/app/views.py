from rest_framework import status, viewsets, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from celery.result import AsyncResult
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, OpenApiExample

from .models import Person
from .serializers import (
    PersonSerializer,
    StatisticsRequestSerializer,
    StatisticsResponseSerializer,
)
from .tasks import long_running_task, calculate_statistics_task


class PersonViewSet(viewsets.ModelViewSet):
  """
  CRUD API for Person with pagination and filtering.
    Provides CRUD operations:
    - POST   /api/persons/      -> 201 Created
    - GET    /api/persons/      -> 200 OK
    - GET    /api/persons/{id}/ -> 200 OK
    - PATCH  /api/persons/{id}/ -> 200 OK
    - DELETE /api/persons/{id}/ -> 204 No Content
    
  Filtering:
    - GET /api/persons/?created_date_after=2024-01-01
    - GET /api/persons/?created_date_before=2024-12-31
    - GET /api/persons/?modified_date_after=2024-01-01
    - GET /api/persons/?modified_date_before=2024-12-31
  """
  queryset = Person.objects.all().order_by("-created_date")
  serializer_class = PersonSerializer
  filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
  filterset_fields = {
    'created_date': ['gte', 'lte', 'exact'],
    'modified_date': ['gte', 'lte', 'exact'],
  }
  ordering_fields = ['created_date', 'modified_date', 'person_name']


class LongTaskStartView(APIView):
  """
  Starts an async Celery task.

  return Response(
      {
        "task_id": task.id,
        "status": "accepted"
      },
      status=status.HTTP_202_ACCEPTED
    )
  """

  def post(self, request):
    task = long_running_task.delay()

    return Response(
      {
        "task_id": task.id,
        "status": "accepted"
      },
      status=status.HTTP_202_ACCEPTED
    )


class LongTaskStatusView(APIView):
  """
  Polling endpoint for async task.

  
  property state

    The tasks current state.

    Possible values includes:

        PENDING

            The task is waiting for execution.

        STARTED

            The task has been started.

        RETRY

            The task is to be retried, possibly because of failure.

        FAILURE

            The task raised an exception, or has exceeded the retry limit. The result attribute then contains the exception raised by the task.

        SUCCESS

            The task executed successfully. The result attribute then contains the tasks return value.

  return Response(
      {
        "task_id": task_id,
        "state": result.state,
        "result": result.result if result.successful() else None
      },
      status=status.HTTP_200_OK
    )
  """

  def get(self, request, task_id):
    result = AsyncResult(str(task_id))

    return Response(
      {
        "task_id": str(task_id),
        "state": result.state,
        "result": result.result if result.successful() else None
      },
      status=status.HTTP_200_OK
    )


class StatisticsTaskView(APIView):
  """
  Starts an async task to calculate mean and standard deviation.
  """
  
  @extend_schema(
    request=StatisticsRequestSerializer,
    responses={202: StatisticsResponseSerializer},
    description="Submit a list of numeric values to calculate mean and standard deviation asynchronously.",
    examples=[
      OpenApiExample(
        name="Example request",
        value={"values": [1, 2, 3, 4, 5]},
        request_only=True,
      )
    ]
  )
  def post(self, request):
    values = request.data.get('values', [])
    
    if not isinstance(values, list):
      return Response(
        {"error": "values must be a list of numbers"},
        status=status.HTTP_400_BAD_REQUEST
      )
    
    try:
      numeric_values = [float(v) for v in values if v is not None]
    except (ValueError, TypeError):
      return Response(
        {"error": "All values must be numeric"},
        status=status.HTTP_400_BAD_REQUEST
      )
    
    task = calculate_statistics_task.delay(numeric_values)
    
    return Response(
      {
        "task_id": task.id,
        "status": "accepted",
        "values_count": len(numeric_values)
      },
      status=status.HTTP_202_ACCEPTED
    )