import json
from django.core.management.base import BaseCommand
from master.data import get_questions, get_choices
from master.models import Question, Choice


class Command(BaseCommand):
    help = 'Populate the database with Questions, Blanks and Choices'

    def handle(self, *args, **options):
        data_questions = get_questions()
        data_choices = get_choices()

        Question.objects.bulk_create(map(lambda q: Question(text=q['text'], blanks=json.dumps(q['blanks'])), data_questions))
        Choice.objects.bulk_create(map(lambda text: Choice(text=text), data_choices))

        self.stdout.write(self.style.SUCCESS('Database populated'))
