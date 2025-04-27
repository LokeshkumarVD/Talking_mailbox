from django.urls import path
from . import views

urlpatterns = [
    path('',views.landing_page,name='landing'),
    path('signup/', views.signup, name='signup'),
    path('process-signup/', views.process_signup, name='process_signup'),
    path('', views.login_page, name='login'),
    path('compose/', views.compose_page, name='compose'),
    path('inbox/', views.inbox_page, name='inbox'),
]
