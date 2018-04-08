from django.test import TestCase
from api.models import Player, Question, Choice, Game, Answer, AnsweredQuestion
from api.serializers import AnsweredQuestionSerializer
from api import game as game_controller

class AnsweredQuestionTestCase(TestCase):
  def setUp(self):
    razpout = Player.objects.create(nick="razpout")

    game = Game.objects.create(lang='fr', owner=razpout)
    game.players.add(razpout)

  def assert_answered_question(self, question, blanks, expected_text, expected_split):
    razpout = Player.objects.first()
    game = Game.objects.first()

    answered_question = AnsweredQuestion.objects.create(game=game, question=question, answered_by=razpout)
    for blank, choice in blanks:
      answered_question.answers.create(position=blank, choice=choice)

    self.assertEqual(str(answered_question), expected_text)
    self.assertEqual(answered_question.get_split_text(), expected_split)

  def test_ansewerd_question_serializer_question(self):
    game = Game.objects.first()
    question = Question.objects.create(game=game, text="Question?")
    choice = Choice.objects.create(game=game, text="Answer!")

    blanks = [
      (None, choice),
    ]

    expected_text = "Answer!"
    expected_split = ["Answer!"]

    self.assert_answered_question(question, blanks, expected_text, expected_split)

  def test_ansewerd_question_serializer_fill_1(self):
    game = Game.objects.first()
    question = Question.objects.create(game=game, text="Do you like ?")
    blank = question.blanks.create(question=question, place=12)
    choice = Choice.objects.create(game=game, text="pie")

    blanks = [
      (blank, choice),
    ]

    expected_text = "Do you like pie ?"
    expected_split = ["Do you like", "pie", "?"]

    self.assert_answered_question(question, blanks, expected_text, expected_split)

  def test_ansewerd_question_serializer_fill_2(self):
    game = Game.objects.first()
    question = Question.objects.create(game=game, text="Do you prefer  or ?")

    blanks = []
    blanks.append(question.blanks.create(question=question, place=14))
    blanks.append(question.blanks.create(question=question, place=18))

    choices = []
    choices.append(Choice.objects.create(game=game, text="us"))
    choices.append(Choice.objects.create(game=game, text="them"))

    blanks = [
      (blanks[0], choices[0]),
      (blanks[1], choices[1]),
    ]

    expected_text = "Do you prefer us or them ?"
    expected_split = ["Do you prefer", "us", "or", "them", "?"]

    self.assert_answered_question(question, blanks, expected_text, expected_split)

  def test_ansewerd_question_serializer_fill_4(self):
    game = Game.objects.first()
    question = Question.objects.create(game=game, text="Avant , tout ce que nous avions était . Un tribunal international a condamné  coupable de .")

    blanks = []
    blanks.append(question.blanks.create(question=question, place=6))
    blanks.append(question.blanks.create(question=question, place=38))
    blanks.append(question.blanks.create(question=question, place=77))
    blanks.append(question.blanks.create(question=question, place=90))

    choices = []
    choices.append(Choice.objects.create(game=game, text="la fin"))
    choices.append(Choice.objects.create(game=game, text="le début"))
    choices.append(Choice.objects.create(game=game, text="superman"))
    choices.append(Choice.objects.create(game=game, text="cuisiner"))

    blanks = [
      (blanks[0], choices[0]),
      (blanks[1], choices[1]),
      (blanks[2], choices[2]),
      (blanks[3], choices[3]),
    ]

    expected_text = "Avant la fin , tout ce que nous avions était le début . Un tribunal international a condamné superman coupable de cuisiner ."
    expected_split = ["Avant", "la fin", ", tout ce que nous avions était", "le début", ". Un tribunal international a condamné", "superman", "coupable de", "cuisiner", "."]

    self.assert_answered_question(question, blanks, expected_text, expected_split)
