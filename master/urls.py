from rest_framework.routers import DefaultRouter
from master import views

router = DefaultRouter()

router.register(r'questions', views.QuestionViewSet, base_name='question')
router.register(r'choices', views.ChoiceViewSet, base_name='choice')

urlpatterns = router.urls
