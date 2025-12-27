import time
import math
from celery import shared_task

@shared_task(bind=True)
def long_running_task(self):
    """
    Simulates a long-running job.

    bind=True allows access to task state via self
    """
    time.sleep(10)
    return {"status": "completed"}


@shared_task(bind=True)
def calculate_statistics_task(self, values):
    """
    Calculates mean and standard deviation from a list of values.
    Simulates heavy processing to demonstrate Celery usage.
    
    Args:
        values: List of numbers to calculate statistics
        
    Returns:
        dict with mean and std_dev
    """
    time.sleep(0.5)
    
    if not values or len(values) == 0:
        return {
            "mean": 0,
            "std_dev": 0,
            "count": 0,
            "error": "No values provided"
        }
    
    n = len(values)
    mean = sum(values) / n
    
    if n > 1:
        variance = sum((x - mean) ** 2 for x in values) / n
        std_dev = math.sqrt(variance)
    else:
        std_dev = 0
    
    return {
        "mean": round(mean, 4),
        "std_dev": round(std_dev, 4),
        "count": n,
        "min": min(values),
        "max": max(values)
    }