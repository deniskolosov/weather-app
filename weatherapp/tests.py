from unittest.mock import patch, Mock

from django.urls import reverse
from rest_framework.test import APITestCase


class TestWeatherApi(APITestCase):
    # Data in format  APIXU weather API serves
    TEST_DATA = {
        "location": {
            "name": "Moscow",
            "region": "Moscow City",
            "country": "Russia",
            "lat": 55.75,
            "lon": 37.62,
            "tz_id": "Europe/Moscow",
            "localtime_epoch": 1491741340,
            "localtime": "2017-04-09 15:35"
        },
        "current": {
            "temp_c": 8.0,
            "condition": {

            },
            "feelslike_c": 5.4
        },
        "forecast": {
            "forecastday": [
                {
                    "date": "2017-04-09",
                    "day": {
                        "maxtemp_c": 7.2,
                        "mintemp_c": 2.2,
                        "avgtemp_c": 3.2,
                        "avghumidity": 67.0,
                        "condition": {
                            "code": 1219
                        }
                    },
                    "astro": {
                        "sunrise": "05:40 AM",
                        "sunset": "07:24 PM",
                        "moonrise": "05:14 PM",
                        "moonset": "05:25 AM"
                    },
                }
            ]
        }
    }

    @patch('weatherapp.views.requests.get')
    def test_response(self, data_mock_func):
        """
        Test the correctness of a response
        """
        data_mock_func.return_value = Mock(status_code=200)
        data_mock_func.return_value.json.return_value = self.TEST_DATA
        city = self.TEST_DATA['location']['name'].lower()
        days = self.TEST_DATA['forecast']['forecastday']
        num_days = len(days)
        url = reverse('weather-api', args=[city, num_days])

        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        for day_data in response.data:
            self.assertIn("max_temp", day_data)
