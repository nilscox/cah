from django.conf import settings
from django.conf.urls import url, include
from django.conf.urls.static import static

urlpatterns = [
    url(r'^api/', include('api.urls')),
    url(r'^api/master/', include('master.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
