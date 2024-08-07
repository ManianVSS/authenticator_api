"""
URL configuration for server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from django.urls import re_path
from django.views.generic import TemplateView
from rest_framework.schemas import get_schema_view
from rest_framework_swagger.renderers import SwaggerUIRenderer, OpenAPIRenderer

from rest_framework_simplejwt import views as jwt_views

from . import settings

schema_view = get_schema_view(title='Authenticator API', renderer_classes=[OpenAPIRenderer, SwaggerUIRenderer])

urlpatterns = [
                  # Admin plugins and other libraries
                  path('admin/', include('massadmin.urls')),
                  path('admin/', admin.site.urls),
                  # For Advanced filters path('advanced_filters/', include('advanced_filters.urls')),

                  # Auth views
                  path('auth/restframework', include('rest_framework.urls', namespace='rest_framework')),
                  path('auth/jwt/login', jwt_views.TokenObtainPairView.as_view()),
                  path('auth/jwt/refresh', jwt_views.TokenRefreshView.as_view()),

                  # Modules
                  path('authenticator/', include('authenticator.urls')),

                  # Swagger
                  path('swagger/', schema_view, name='docs'),

                  # Trap code access (?(py|sh|bat|htaccess))
                  re_path('(^.*[.](py|sh|bat|htaccess)$)',
                          TemplateView.as_view(template_name='errors/forbidden.html')),

                  re_path(
                      '(^(?!(data|admin|swagger|authenticator)).*$)',
                      TemplateView.as_view(template_name='index.html')),
              ] + static(settings.STATIC_URL,
                         document_root=settings.STATICFILES_DIRS) \
              + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
