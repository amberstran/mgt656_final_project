from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponseRedirect
from django.urls import reverse

def redirect_root_to_profile(request):
    return HttpResponseRedirect(reverse('profile'))

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('django.contrib.auth.urls')),  # Adds login/logout URLs
    path('', redirect_root_to_profile, name='root'),
    path('', include('core.urls')),
]
