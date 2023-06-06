from django.urls import re_path
from experimenter.changelogs.views import NimbusChangeLogsView


urlpatterns = [
    re_path(r"^(?P<slug>[\w-]+)/changelogs/$",  NimbusChangeLogsView.as_view(), name='index'),
]