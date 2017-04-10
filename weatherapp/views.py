import os
import requests
import requests_cache
from django.shortcuts import render

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view


API_URL = "http://api.apixu.com/v1/forecast.json"
APIXU_KEY = os.environ['APIXU_KEY']

# Weather data cache to prevent APIXU API ban
requests_cache.install_cache(cache_name='weather_data_cache',
                             backend='sqlite', expire_after=60)


@api_view(['GET'])
def get_weather_data(request, city, days):
    code = None
    # Try to fetch weather data using requests
    try:
        params = {
            "key": APIXU_KEY,
            "q": city,
            "days": days
        }
        resp = requests.get(API_URL, params=params)
        code = resp.status_code
        json_data = resp.json()
    except KeyError:
        return Response(
            status=code if code else status.HTTP_404_NOT_FOUND
        )
    except ValueError:
        return Response(
            status=code if code else status.HTTP_400_BAD_REQUEST
        )

    if code != status.HTTP_200_OK:
        return Response(status=code, data=resp)

    # If everything is ok, parse forecast data for each day
    data = [{
      "max_temp": day["day"]["maxtemp_c"],
      "min_temp": day["day"]["mintemp_c"],
      "avg_temp": day["day"]["avgtemp_c"],
      "humidity": day["day"]["avghumidity"]
    } for day in json_data["forecast"]["forecastday"]]

    return Response(data)


def index(request):
    return render(request, 'index.html')
