from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view()
def root(request):
    return Response()


@api_view()
def version(request):
    return Response('1.2.3')
