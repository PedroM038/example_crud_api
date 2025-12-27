import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get("SECRET_KEY", "unsafe-dev-key")
DEBUG = os.environ.get("DEBUG", "0") == "1"
ALLOWED_HOSTS = ["*"]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party
    "rest_framework",
    "drf_spectacular",
    "corsheaders",
    "django_filters",

    # Local apps
    "app",
]

DATABASES = {
  "default": {
    "ENGINE": "django.db.backends.postgresql",
    "NAME": os.environ.get("POSTGRES_DB", "postgres"),
    "USER": os.environ.get("POSTGRES_USER", "postgres"),
    "PASSWORD": os.environ.get("POSTGRES_PASSWORD", "postgres"),
    "HOST": os.environ.get("POSTGRES_HOST", "db"),
    "PORT": os.environ.get("POSTGRES_PORT", "5432"),
  }
}


################begin PAGINATION ADDON
REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",

    # Enable pagination for list endpoints
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.LimitOffsetPagination",
    "PAGE_SIZE": 10,
    
    # Enable filtering
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.OrderingFilter",
    ],
}
################end PAGINATION ADDON

SPECTACULAR_SETTINGS = {
    "TITLE": "Person CRUD API",
    "DESCRIPTION": "Simple CRUD API for educational purposes",
    "VERSION": "1.0.0",
}

STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

################begin CELERY ADDON
CELERY_BROKER_URL = os.environ.get(
  "REDIS_URL",
  "redis://localhost:6379/0"
)

CELERY_RESULT_BACKEND = CELERY_BROKER_URL

CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"

CELERY_TASK_TRACK_STARTED = True
################end CELERY ADDON

MIDDLEWARE = [
  "corsheaders.middleware.CorsMiddleware",
  "django.middleware.security.SecurityMiddleware",
  "django.contrib.sessions.middleware.SessionMiddleware",
  "django.middleware.common.CommonMiddleware",
  "django.middleware.csrf.CsrfViewMiddleware",
  "django.contrib.auth.middleware.AuthenticationMiddleware",
  "django.contrib.messages.middleware.MessageMiddleware",
  "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

TEMPLATES = [
  {
    "BACKEND": "django.template.backends.django.DjangoTemplates",
    "DIRS": [],
    "APP_DIRS": True,
    "OPTIONS": {
      "context_processors": [
        "django.template.context_processors.debug",
        "django.template.context_processors.request",
        "django.contrib.auth.context_processors.auth",
        "django.contrib.messages.context_processors.messages",
      ],
    },
  },
]

ROOT_URLCONF = "config.urls"

WSGI_APPLICATION = "config.wsgi.application"

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

CORS_ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://0.0.0.0:3000",
]

# CORS_ALLOW_ALL_ORIGINS = True