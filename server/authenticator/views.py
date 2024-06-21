from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from authenticator.models import Secret
from authenticator.serializers import SecretSerializer

exact_fields_filter_lookups = ['exact', ]
# many_to_many_id_field_lookups = ['contains']
id_fields_filter_lookups = ['exact', 'in', ]
string_fields_filter_lookups = ['exact', 'iexact', 'icontains', 'regex', ]
# 'startswith', 'endswith', 'istartswith','iendswith', 'contains',
compare_fields_filter_lookups = ['exact', 'lte', 'lt', 'gt', 'gte', ]
date_fields_filter_lookups = ['exact', 'lte', 'gte', 'range', ]
# date,year, month, day, week, week_day, iso_week, iso_week_day, quarter
datetime_fields_filter_lookups = ['exact', 'lte', 'gte', 'range', ]
# time, hour, minute, second
default_search_fields = ['name', 'summary', 'description', ]
default_ordering = ['id', ]


# Create your views here.
class SecretViewSet(viewsets.ModelViewSet):
    queryset = Secret.objects.all()
    serializer_class = SecretSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ['user', 'domain', ]
    ordering_fields = ['id', 'issuer', 'user', 'initialized', 'created_at', 'updated_at', ]
    ordering = default_ordering
    filterset_fields = {
        'id': id_fields_filter_lookups,
        'user': string_fields_filter_lookups,
        'secret': string_fields_filter_lookups,
        'issuer': string_fields_filter_lookups,
        'url': string_fields_filter_lookups,
        'initialized': exact_fields_filter_lookups,
    }
