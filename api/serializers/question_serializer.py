from rest_framework import serializers
from api.models import Question


class QuestionSerializer(serializers.ModelSerializer):
    """
    Question: {
        id: integer,
        type: string,
        text: string,
        split: (string | null)[],
        nb_choices: integer,
    }
    """

    text = serializers.ReadOnlyField(source='__str__')
    type = serializers.SerializerMethodField()
    split = serializers.ReadOnlyField(source='get_split_text')
    nb_choices = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = ('id', 'type', 'text', 'split', 'nb_choices')

    def get_type(self, question):
        return "question" if question.blanks.count() == 0 else "fill"

    def get_nb_choices(self, question):
        return max(1, question.blanks.count())
