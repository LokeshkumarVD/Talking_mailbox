from django.urls import path
from . import views

urlpatterns = [
    path('',views.landing_page,name='landing'),
    path('signup/', views.signup, name='signup'),
     path('process_signup/', views.process_signup, name='process_signup'),
    path('signin/', views.signin,name='signin'),
    path('dashboard/', views.dashboard_page, name='dashboard'),
    path('compose/', views.compose_page, name='compose'),
    path('inbox/', views.inbox_page, name='inbox'),
    path('sent/', views.sent_page, name='sent'),
    path('star/', views.star_page, name='star'),
    path('trash/', views.trash_page, name='trash'),
    path('archive/', views.archive_page, name='archive'),
    path('logout/', views.logout_view, name='logout'),

]
