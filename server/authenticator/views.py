from rest_framework import viewsets
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, BasePermission, DjangoModelPermissions

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


class IsObjectOwner(DjangoModelPermissions):
    # for view permission
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    # for object level permissions
    def has_object_permission(self, request, view, vacation_obj):
        return (vacation_obj is not None) and (request is not None) and (request.user is not None) and (
            not request.user.is_anonymous) and (vacation_obj.owner.id == request.user.id)


class CustomGroupViewSet(viewsets.ModelViewSet):
    permission_classes = (IsObjectOwner,)

    def get_queryset(self):
        user = self.request.user
        if (user is None) or user.is_superuser:
            return super().get_queryset()

        model = self.queryset.model

        if (self.action == 'list') and hasattr(model, 'get_list_query_set'):
            return model.get_list_query_set(model, self.request.user)
        else:
            return super().get_queryset()


# Create your views here.
class SecretViewSet(CustomGroupViewSet):
    queryset = Secret.objects.all()
    serializer_class = SecretSerializer
    # permission_classes = [CustomGroupViewSet]
    search_fields = ['user', 'domain', ]
    ordering_fields = ['id', 'owner', 'issuer', 'user', 'initialized', 'created_at', 'updated_at', ]
    ordering = default_ordering
    filterset_fields = {
        'id': id_fields_filter_lookups,
        'owner': id_fields_filter_lookups,
        'user': string_fields_filter_lookups,
        'secret': string_fields_filter_lookups,
        'issuer': string_fields_filter_lookups,
        'url': string_fields_filter_lookups,
        'initialized': exact_fields_filter_lookups,
    }
