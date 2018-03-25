from django.conf.urls import url, include

urlpatterns = [
    url(r'^api/', include('api.urls')),
    url(r'^api/master/', include('master.urls')),
]
