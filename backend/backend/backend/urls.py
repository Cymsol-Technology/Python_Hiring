from django.urls import path,include
from accounts.views import create_admin, register, login, logout
from vessel_data.views import vessels_list, vessel_data_list, vessel_data_view, vessel_data_create, admin_aggregate, vessel_data_update,hscode_list


urlpatterns = [
    path("api/create-admin/", create_admin),
    path("api/register/", register),
    path("api/login/", login),
    path("api/logout/", logout),
    path('vessels/', vessels_list, name='vessels_list'),
    path('vessel_data/', vessel_data_list, name='vessel_data_list'),
    path('vessel_data/view/', vessel_data_view, name='vessel_data_view'),
    path('vessel_data/create/', vessel_data_create, name='vessel_data_create'),
    path('vessel_data/update/<uuid:pk>/', vessel_data_update, name='vessel_data_update'),
    path('vessel_data/aggregate/', admin_aggregate, name='admin_aggregate'),
    path('hscode/list/', hscode_list, name = 'hscode_list')
    
]
