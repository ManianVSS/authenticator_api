from django.contrib import admin
from django.contrib.admin import RelatedOnlyFieldListFilter
from django.core.exceptions import FieldDoesNotExist
from import_export.admin import ImportExportModelAdmin
from massadmin.massadmin import MassEditMixin

from .models import Secret

# Register your models here.

admin.site.site_header = "Authenticator Application"
admin.site.site_title = "Authenticator Application"
admin.site.index_title = "Welcome to Authenticator Application"


class CustomModelAdmin(MassEditMixin, ImportExportModelAdmin):
    save_as = True
    readonly_fields = 'id'
    exclude = ('owner',)

    # ordering = ('-id',)
    # search_fields = ['name', 'summary', 'description', ]

    # noinspection PyProtectedMember
    # def get_list_display(self, request):
    #     return [f.name for f in self.model._meta.get_fields() if f.concrete and
    #             not (f.many_to_many or f.one_to_many)]

    def save_model(self, request, obj, form, change):
        # if hasattr(obj, 'owner'):
        obj.owner = request.user
        super().save_model(request, obj, form, change)

    def has_permission(self, request, obj=None):
        if (request is None) or (request.user is None):
            return False

        if request.user.is_superuser:
            return super().has_view_permission(request, obj)

        if request.user.is_anonymous:
            return False

        if super().has_view_permission(request, obj):
            if obj is None:
                return True
            try:
                return not hasattr(obj, 'can_access') or obj.can_access(request.user)
            except FieldDoesNotExist:
                return False
        else:
            return False

    def has_view_permission(self, request, obj=None):
        return self.has_permission(request, obj)

    def has_change_permission(self, request, obj=None):
        return self.has_permission(request, obj)

    def has_delete_permission(self, request, obj=None):
        return self.has_permission(request, obj)

    # Allow only listing of entities that can be viewed by the user
    def get_queryset(self, request):
        if request.user is None:
            return super().get_queryset(request)
        else:
            if ((request.method == 'GET')
                    and not request.path.endswith('/change/')
                    and hasattr(self.model, 'get_list_query_set')):
                return self.model.get_list_query_set(self.model, request.user)
            else:
                return super().get_queryset(request)


@admin.register(Secret)
class SecretAdmin(CustomModelAdmin):
    list_filter = (
        ('owner', RelatedOnlyFieldListFilter),
        'created_at', 'updated_at',
        'issuer',
        'user',
        'initialized',
    )
    search_fields = ['user', 'domain', ]
    readonly_fields = ('id', 'initialized',)
    exclude = ('owner',)
    list_display = ('id', 'user', 'issuer', 'qr_code',)
