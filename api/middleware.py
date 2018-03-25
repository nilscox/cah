import json
import time

import django.conf
import django.core.exceptions
from django.http import HttpResponse
from rest_framework import status


class ApiErrorMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    # def process_exception(self, request, exception):
    #     print(exception)
    #
    #     error = {"detail": " ".join(exception.args)}
    #
    #     response = HttpResponse(json.dumps(error), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    #     response["Content-Type"] = "application/json"
    #
    #     return response


# https://gist.github.com/josharian/1453629
# For testing purpose

class SleepMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response

        self.sleep_time = getattr(django.conf.settings, "SLEEP_TIME", 0)
        if not isinstance(self.sleep_time, (int, float)) or self.sleep_time <= 0:
            raise django.core.exceptions.MiddlewareNotUsed

    def __call__(self, request):
        response = self.get_response(request)

        time.sleep(self.sleep_time)

        return response
