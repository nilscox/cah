from rest_framework import serializers
from api.models import AnsweredQuestion
from .question_serializer import QuestionSerializer

class AnsweredQuestionSerializer(serializers.ModelSerializer):
    """
    AnsweredQuestion: {
        id: integer,
        question: Question,
        text: string,
        split: string[],
        answers: Choice[],
        answered_by: string,
        selected_by: string | null,
    }
    """

    question = QuestionSerializer(read_only=True)
    text = serializers.ReadOnlyField(source='__str__')
    split = serializers.ReadOnlyField(source='get_split_text')
    answers = serializers.SerializerMethodField()
    answered_by = serializers.ReadOnlyField(source='answered_by.nick')
    selected_by = serializers.ReadOnlyField(source='selected_by.nick')

    class Meta:
        model = AnsweredQuestion
        fields = ('id', 'question', 'text', 'split', 'answers', 'answered_by', 'selected_by')

    def get_answers(self, aq):
        choices = list(map(lambda a: a.choice, aq.answers.all()))
        return ChoiceSerializer(choices, many=True).data


class PartialAnsweredQuestionSerializer(AnsweredQuestionSerializer):
    """
    PartialAnsweredQuestion: {
        id: integer,
        question: Question,
        text: string,
        split: string[],
        answers: Choice[],
    }
    """

    class Meta:
        model = AnsweredQuestion
        fields = ('id', 'question', 'text', 'split', 'answers')


class LightAnsweredQuestionSerializer(AnsweredQuestionSerializer):
    """
    LightAnsweredQuestion: {
        id: integer,
        text: string,
        split: string[],
        answered_by: string,
    }
    """

    class Meta:
        model = AnsweredQuestion
        fields = ('id', 'text', 'split', 'answered_by')
