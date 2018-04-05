import json
from rest_framework import serializers
from master.models import Question, Choice

class JSONStrField(serializers.Field):

    def to_representation(self, obj):
        return json.loads(obj)

    def to_internal_value(self, data):
        if type(data) is not list:
            raise serializers.ValidationError('blanks must be an array')

        for blank in data:
            if type(blank) is not int:
                raise serializers.ValidationError('blanks must be an array of integers')

        return json.dumps(data)


class QuestionSerializer(serializers.ModelSerializer):
    blanks = JSONStrField(default=[])

    class Meta:
        model = Question
        fields = ('id', 'text', 'blanks')


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ('id', 'text')
