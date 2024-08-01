import io

import cv2
import pyotp
import qrcode
from django.contrib.auth.models import User
from django.core.files.base import ContentFile
from django.db import models
from django.db.models import Q
from django.db.models.signals import post_save
from django.dispatch import receiver

from authenticator.storage import CustomFileSystemStorage


# Create your models here.


class Secret(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='secret owner')
    user = models.CharField(max_length=256, null=True, blank=True)
    secret = models.CharField(max_length=256, null=True, blank=True)
    issuer = models.CharField(max_length=256, null=True, blank=True)
    url = models.CharField(max_length=1024, null=True, blank=True)
    qr_code = models.ImageField(storage=CustomFileSystemStorage, upload_to='automation', blank=True, null=True,
                                verbose_name='QR-Code image file in PNG format')
    initialized = models.BooleanField(default=False, verbose_name='is already initialized')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def can_access(self, user):
        return (user is not None) and (self.owner == user)

    def get_list_query_set(self, user):
        if user is None:
            return self.objects.none()

        user_id = user.id

        if user.is_superuser:
            return self.objects.all()
        elif user.is_anonymous:
            return self.objects.none()
        else:
            return self.objects.filter(Q(owner__pk=user_id)).distinct()


def parse_qr_code(instance):
    image = cv2.imread(instance.qr_code.path)
    detector = cv2.QRCodeDetector()
    data, bbox, straight_qrcode = detector.detectAndDecode(image)
    if bbox is not None:
        instance.url = data
        return True
    return False


def parse_secret_fields(instance, otp_object):
    if not instance.user:
        instance.user = otp_object.name
    if not instance.secret:
        instance.secret = otp_object.secret
    if not instance.issuer:
        instance.issuer = otp_object.issuer


def create_qr_code(instance):
    image = qrcode.make(instance.url)
    buf = io.BytesIO()
    image.save(buf, "PNG")
    contents = buf.getvalue()
    content_file = ContentFile(contents, name="AuthenticationSecretQRCode-" + str(instance.id) + ".png")
    instance.qr_code = content_file


@receiver(post_save, sender=Secret, dispatch_uid="update_secrets")
def update_secrets(sender, instance, **kwargs):
    if instance is not None:
        if not instance.initialized:
            if (instance.qr_code is not None) and (instance.qr_code.name is not None):
                if parse_qr_code(instance):
                    otp_object = pyotp.parse_uri(instance.url)
                    parse_secret_fields(instance, otp_object)
                    instance.initialized = True
                    instance.save()
            elif instance.url:
                otp_object = pyotp.parse_uri(instance.url)
                parse_secret_fields(instance, otp_object)
                create_qr_code(instance)
                instance.initialized = True
                instance.save()
            elif (instance.user is not None) and (instance.secret is not None) and (instance.issuer is not None):
                otp_object = pyotp.totp.TOTP(instance.secret).provisioning_uri(name=instance.user,
                                                                               issuer_name=instance.issuer)
                instance.url = str(otp_object)

                create_qr_code(instance)
                instance.initialized = True
                instance.save()
