from django.urls import path
from . import views

urlpatterns = [
    path('',views.landing_page,name='landing'),
    path('signup/', views.signup, name='signup'),
    path('process-signup/', views.process_signup, name='process_signup'),
    path('signin/', views.signin, name='signin'),  # <-- ADD THIS
    path('compose/', views.compose_page, name='compose'),
    path('dashboard/', views.inbox_page, name='dashboard'),
    path('inbox/', views.inbox_page, name='inbox'),
]
