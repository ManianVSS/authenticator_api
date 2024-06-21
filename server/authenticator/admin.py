from django.contrib import admin
from django.contrib.admin import RelatedOnlyFieldListFilter
from import_export.admin import ImportExportModelAdmin
from massadmin.massadmin import MassEditMixin

from .models import Secret

# Register your models here.

admin.site.site_header = "Authenticator Application"
admin.site.site_title = "Authenticator Application"
admin.site.index_title = "Welcome to Authenticator Application"


class CustomModelAdmin(MassEditMixin, ImportExportModelAdmin):
    save_as = True
    readonly_fields = ('id',)

    # ordering = ('-id',)
    # search_fields = ['name', 'summary', 'description', ]

    # noinspection PyProtectedMember
    def get_list_display(self, request):
        return [f.name for f in self.model._meta.get_fields() if f.concrete and
                not (f.many_to_many or f.one_to_many)]


@admin.register(Secret)
class SecretAdmin(CustomModelAdmin):
    list_filter = (
        'created_at', 'updated_at',
        'issuer',
        'user',
        'initialized',
    )
    search_fields = ['user', 'domain', ]
    readonly_fields = ('initialized',)
