from django.core.management.base import BaseCommand
from master.data import get_questions, get_choices
from master.models import Question, Choice


class Command(BaseCommand):
    help = 'Populate the database with Questions, Blanks and Choices'

    def handle(self, *args, **options):
        data_questions = get_questions()
        data_choices = get_choices()

        for dq in data_questions:
            question = Question(text=dq['text'])
            question.save()

            if dq['blanks']:
                for place in dq['blanks']:
                    question.blanks.create(place=place)

        Choice.objects.bulk_create(map(lambda text: Choice(text=text), data_choices))

        self.stdout.write(self.style.SUCCESS('Database populated'))
