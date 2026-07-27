"""
URL configuration for backend_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
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
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from marketplace import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', views.api_login),
    path('api/productos/', views.api_productos),
    path('api/pedidos/', views.api_pedidos),
    path('api/min-order/', views.api_min_order),
    path('api/tests/', views.api_tests),
    path('api/tests/take/', views.api_take_test),
    path('api/logout/', views.api_logout),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

