from rest_framework.routers import DefaultRouter
from master import views

router = DefaultRouter()

router.register(r'questions', views.QuestionViewSet)
router.register(r'choices', views.ChoiceViewSet)

urlpatterns = router.urls
