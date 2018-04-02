import json
from django.core.management.base import BaseCommand
from master.data import get_questions, get_choices
from master.models import Question, Choice


class Command(BaseCommand):
    help = 'Populate the database with Questions, Blanks and Choices'

    def handle(self, *args, **options):
      for lang in ['en', 'fr']:
        self.populate_choices(lang)
        self.populate_questions(lang)

      self.stdout.write(self.style.SUCCESS('Database populated'))

    def populate_choices(self, lang):
        data_choices = get_choices(lang)
        Choice.objects.bulk_create(map(lambda text: Choice(lang=lang, text=text), data_choices))

    def populate_questions(self, lang):
        data_questions = get_questions(lang)
        Question.objects.bulk_create(map(lambda q: Question(lang=lang, text=q['text'], blanks=json.dumps(q['blanks'])), data_questions))
