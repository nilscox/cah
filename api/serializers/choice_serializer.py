from rest_framework import serializers
from api.models import Choice


class ChoiceSerializer(serializers.ModelSerializer):
    """
    Choice: {
        id: integer,
        text: string,
    }
    """

    text = serializers.ReadOnlyField(source='__str__')
    keepCapitalization = serializers.ReadOnlyField(source='keep_capitalization')

    class Meta:
        model = Choice
        fields = ('id', 'text', 'keepCapitalization')
