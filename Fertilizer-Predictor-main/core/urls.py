from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    path('', views.home_view, name='home'),
    path('about/', views.about_view, name='about'),
    path('analysis/', views.analysis_view, name='analysis'),
    path('predict/', views.predict_view, name='predict'),
    path('team/', views.team_view, name='team'),
    path('contact/', views.contact_view, name='contact'),
]
