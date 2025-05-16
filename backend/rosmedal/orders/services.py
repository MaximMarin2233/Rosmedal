from .models import Order
from subscriptions.models import Subscription
from courses.models import Course


def count_order_price(order_data: dict):
    """Считает стоимость заказа"""

    order_price = 0

    purchases = order_data['purchases']
    
    for purchase in purchases:
        content_type = purchase['content_type']
        object_pk = purchase['object_id']
        if content_type.model == 'subscription':
            price = Subscription.objects.get(pk=object_pk).price
            order_price += price
        
        # if content_type.model == 'document':
        #     ... 
        # if content_type.model == 'course':
        #     ... 
        

    return order_price
