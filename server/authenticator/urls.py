from django.urls import include, path
from rest_framework import routers

from .apiviews import generate_totp
from .views import SecretViewSet

router = routers.DefaultRouter()

router.register(r'secrets', SecretViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('api/', include(router.urls)),
    path('api/generate_totp', generate_totp),
]
