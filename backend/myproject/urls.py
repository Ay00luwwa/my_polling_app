from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from polls.views import QuestionViewSet, ChoiceViewSet

router = DefaultRouter()
router.register(r'questions', QuestionViewSet)
router.register(r'choices', ChoiceViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('admin/', admin.site.urls),
]
