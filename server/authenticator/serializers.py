from rest_framework import serializers

from .models import Secret


class SecretSerializer(serializers.ModelSerializer):
    class Meta:
        model = Secret
        fields = ['id', 'user', 'secret', 'issuer', 'url', 'qr_code', 'initialized', 'created_at', 'updated_at', ]
