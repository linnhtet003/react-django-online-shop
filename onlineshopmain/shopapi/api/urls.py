from django.urls import path
from .views.userview import UserList, RegisterUser, UserDetail, UserUpdate
from .views.categoryview import Category, CategoryCreate, CategoryDetail, CategoryUpdate, CategoryDelete
from .views.neworpopularview import neworpupular, neworpupularCreate, neworpupularDetail, neworpupularUpdate, neworpupularDelete
from .views.productview import ProductsList, ProductCreate, ProductDetail, ProductUpdate, ProductDelete
from .views.reviewsview import ReviewList, ReviewCreate, ReviewDelete
from .views.orderview import OrderCreate, OrderList, OrderDetail, OrderUpdate, OrderDelete

urlpatterns = [
    path('userlist/', UserList.as_view(), name='user_list'),
    path('register/', RegisterUser.as_view(), name='register_user'),
    path('userdetail/', UserDetail.as_view(), name='user_detail'),
    path('userupdate/', UserUpdate.as_view(), name='user_update'),

    # Category
    path('categorylist/', Category.as_view(), name='category_list'),
    path('categorycreate/', CategoryCreate.as_view(), name='category_create'),
    path('categorydetail/<int:pk>/', CategoryDetail.as_view(), name='category_detail'),
    path('categoryupdate/<int:pk>/', CategoryUpdate.as_view(), name='category_update'),
    path('categorydelete/<int:pk>/', CategoryDelete.as_view(), name='category_delete'),

    # NeworPopular
    path('neworpolist/', neworpupular.as_view(), name='neworpo_list'),
    path('neworpocreate/', neworpupularCreate.as_view(), name='neworpo_create'),
    path('neworpodetail/<int:pk>/', neworpupularDetail.as_view(), name='neworpo_detail'),
    path('neworpoupdate/<int:pk>/', neworpupularUpdate.as_view(), name='neworpo_update'),
    path('neworpodelete/<int:pk>/', neworpupularDelete.as_view(), name='neworpo_delete'),

    # Products
    path('productlist/', ProductsList.as_view(), name='product_list'),
    path('productcreate/', ProductCreate.as_view(), name='product_create'),
    path('productdetail/<int:pk>/', ProductDetail.as_view(), name='product_detail'),
    path('productupdate/<int:pk>/', ProductUpdate.as_view(), name='product_update'),
    path('productdelete/<int:pk>/', ProductDelete.as_view(), name='product_delete'),

    # Reviews
    path('reviewlist/', ReviewList.as_view(), name='review_list'),
    path('reviewcreate/', ReviewCreate.as_view(), name='review_create'),
    path('reviewdelete/<int:pk>/', ReviewDelete.as_view(), name='review_delete'),

    # Order
    path('ordercreate/', OrderCreate.as_view(), name='order_create'),
    path('orderlist/', OrderList.as_view(), name='order-list'),
    path('orderdetail/<int:pk>/', OrderDetail.as_view(), name='order_detail'),
    path('orderupdate/<int:pk>/', OrderUpdate.as_view(), name='order_update'),
    path('orderdelete/<int:pk>/', OrderDelete.as_view(), name='order_delete'),
]