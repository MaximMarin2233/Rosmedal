import logging
import json
from decimal import Decimal

from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.contenttypes.models import ContentType
from django.db import transaction

from core.utils import get_client_ip
from billing.models import Transaction
from accounts.models import User
from docs.models import Document
from docs.services import DocumentPurchaseService
from orders.models import Order, Purchase, PromotionalCode
from referral.models import Referral
from subscriptions.models import Subscription
from subscriptions.services import SubscriptionPurchaseService
from courses.models import UserCourseAddition, UserCourse
from courses.services import CoursePurchaseService

from yookassa.domain.common.security_helper import SecurityHelper
from yookassa.domain.notification import WebhookNotificationFactory, WebhookNotificationEventType


# View для уведомления о пополнении
@csrf_exempt
@transaction.atomic()
def payment_alerts(request):
    request_ip = get_client_ip(request)
    data = json.loads(request.body.decode('utf-8'))
    if SecurityHelper().is_ip_trusted(request_ip):
        try:
            # YOOKASSA WEBHOOK HANDLE
            notification_object = WebhookNotificationFactory().create(data)
            response_object = notification_object.object
            metadata = response_object.metadata
            if metadata.get("transaction_id"):
                transaction_id = response_object.metadata.get('transaction_id')
                transaction = Transaction.objects.get(pk=transaction_id)
                if notification_object.event == WebhookNotificationEventType.PAYMENT_SUCCEEDED:
                    transaction.status = Transaction.StatusChoices.SUCCESS
                elif notification_object.event == WebhookNotificationEventType.PAYMENT_CANCELED:
                    transaction.status = Transaction.StatusChoices.ERROR
                transaction.save()
            if metadata.get("documents"):
                user_id = metadata.get("user")
                promotional_code_id = metadata.get("promotional_code")
                documents_as_str = metadata.get("documents")
                documents_as_list = json.loads(documents_as_str)

                documents = Document.objects.filter(id__in=documents_as_list)
                user = User.objects.get(id=user_id)
                if promotional_code_id:
                    promotional_code = PromotionalCode.objects.get(id=promotional_code_id)
                else:
                    promotional_code = None
                use_bonus = metadata.get("use_bonus")

                document_purchase_service = DocumentPurchaseService(
                    documents=documents,
                    user=user,
                    promotional_code=promotional_code,
                    use_bonus=use_bonus
                )
                if notification_object.event == WebhookNotificationEventType.PAYMENT_SUCCEEDED:
                    document_purchase_service.confirm_purchase()
            if metadata.get("subscription"):
                user_id = metadata.get("user")
                subscription_id = metadata.get("subscription")

                user = User.objects.get(id=user_id)
                subscription = Subscription.objects.get(id=subscription_id)

                subscription_purchase_service = SubscriptionPurchaseService(
                    user=user,
                    subscription=subscription
                )
                if notification_object.event == WebhookNotificationEventType.PAYMENT_SUCCEEDED:
                    subscription_purchase_service.confirm_purchase()
            if metadata.get("user_course"):
                user_course_id = metadata.get("user_course")
                promotional_code_id = metadata.get("promotional_code")
                additions = json.loads(metadata.get("additions"))
                if not additions:
                    additions = []

                additions = UserCourseAddition.objects.filter(id__in=additions)
                user_course = UserCourse.objects.get(id=user_course_id)
                if promotional_code_id:
                    promotional_code = PromotionalCode.objects.get(id=promotional_code_id)
                else:
                    promotional_code = None

                course_purchase_service = CoursePurchaseService(
                    user_course=user_course,
                    additions=additions,
                    promotional_code=promotional_code,
                )
                if notification_object.event == WebhookNotificationEventType.PAYMENT_SUCCEEDED:
                    course_purchase_service.confirm_purchase()
        except Exception as ex:
            logger = logging.getLogger("django")
            logger.error(ex, exc_info=True)
            return HttpResponse(status=400)
    else:
        return HttpResponse(status=400)
    return HttpResponse(status=200)
