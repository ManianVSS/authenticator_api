import time

import pyotp
from django.http import HttpResponse
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Secret
from .views import IsObjectOwner


@api_view(['GET'])
@permission_classes((IsObjectOwner,))
def generate_totp(request):
    if not request.method == 'GET':
        return HttpResponse(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    if (request.user is None) or request.user.is_anonymous:
        return HttpResponse(status=status.HTTP_401_UNAUTHORIZED, content='Not an authenticated user')

    authenticator_secret_id = None
    if 'authenticator_secret' in request.GET:
        authenticator_secret_id = request.query_params.get('authenticator_secret')
    else:
        return HttpResponse(status=status.HTTP_400_BAD_REQUEST, content='Missing parameter authenticator_secret')

    try:
        authenticator_secret = Secret.objects.get(
            pk=authenticator_secret_id) if authenticator_secret_id else None
    except Secret.DoesNotExist:
        return HttpResponse(status=status.HTTP_404_NOT_FOUND, content='Could not find authenticator secret passed')

    if not authenticator_secret.can_access(request.user):
        return HttpResponse(status=status.HTTP_401_UNAUTHORIZED, content='This secret does not seem to belong to you')

    otp_object = pyotp.parse_uri(authenticator_secret.url)
    seconds_remaining = 30 - int(time.strftime("%s", time.localtime())) % 30

    # noinspection PyUnresolvedReferences
    return_object = {
        'otp': otp_object.now(),
        'validity_in_seconds': seconds_remaining
    }
    return Response(return_object)
