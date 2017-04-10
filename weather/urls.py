from django.conf.urls import url
from weatherapp import views


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'api/weather/(?P<city>[a-z-]+)/(?P<days>[0-9])/$',
        views.get_weather_data, name='weather-api')
]
