from rest_framework import serializers

from .models import Secret


class CustomSerializer(serializers.ModelSerializer):
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())


class SecretSerializer(CustomSerializer):
    initialized = serializers.HiddenField(default=False)

    class Meta:
        model = Secret
        fields = ['id', 'owner', 'user', 'secret', 'issuer', 'url', 'qr_code', 'initialized', 'created_at',
                  'updated_at', ]
