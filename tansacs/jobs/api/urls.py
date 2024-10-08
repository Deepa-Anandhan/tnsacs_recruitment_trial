from django.urls import path
from . import views

urlpatterns = [
    path('job', views.JobView.as_view(), name='job'),

    path('download/<int:pk>',
         views.application_success, name="application_success"),
    path('admin_download/<int:pk>', views.application_summary_admin,
         name="application_summary_admin"),
    
    path('dummy/',views.show_view , name="dummy")

]
