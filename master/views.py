from rest_framework import viewsets
from master.models import Question, Choice
from master.serializers import QuestionSerializer, ChoiceSerializer


class QuestionViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionSerializer

    def get_queryset(self):
        lang = self.request.query_params.get('lang', None)
        queryset = Question.objects.all()

        if lang:
            queryset = queryset.filter(lang=lang)

        return queryset

class ChoiceViewSet(viewsets.ModelViewSet):
    serializer_class = ChoiceSerializer

    def get_queryset(self):
        lang = self.request.query_params.get('lang', None)
        queryset = Choice.objects.all()

        if lang:
            queryset = queryset.filter(lang=lang)

        return queryset
