import random

from master import models as master
from api import events
from api.exceptions import *
from api.models import Question, Choice, AnsweredQuestion, GameTurn

MIN_PLAYERS_TO_START = 2


def init(game):
    mquestions = list(master.Question.objects.filter(lang=game.lang))
    mchoices = list(master.Choice.objects.filter(lang=game.lang))

    if not mquestions:
        raise NoQuestionFound

    if not mchoices:
        raise NoChoiceFound

    random.shuffle(mquestions)
    random.shuffle(mchoices)

    questions = list(map(lambda mq: Question(game=game, text=mq.text), mquestions))
    Question.objects.bulk_create(questions)

    for idx, question in enumerate(questions):
        for place in mquestions[idx].get_blanks():
            question.blanks.create(place=place)

    choices = map(lambda mc: Choice(game=game, text=mc.text), mchoices)
    Choice.objects.bulk_create(choices)

    events.game_created(game.owner)


def start(game):
    if game.players.count() < MIN_PLAYERS_TO_START:
        raise NotEnoughPlayers

    game.state = 'started'
    game.question_master = random.choice(game.players.all())

    game.deal_cards()
    game.pick_question()
    game.save()

    events.game_started(game)


def next_turn(game, question_master):
    game.question_master = question_master

    game.deal_cards()
    game.pick_question()
    game.save()

    events.next_turn(game)


def answer(game, choices, answered_by):
    question = game.current_question
    answered_question = AnsweredQuestion(game=game, question=question, answered_by=answered_by)
    answered_question.save()

    blanks = question.blanks.order_by('place')

    for i in range(len(choices)):
        choice = choices[i]
        blank = None

        if question.blanks.count() > 0:
            blank = blanks[i]

        answered_question.answers.create(position=blank, choice=choice)

        choice.owner = None
        choice.played = True
        choice.save()

    events.answer_submitted(game, answered_by)

    if game.get_propositions().count() == game.players.count() - 1:
        all_answers_submitted(game)

    return answered_question


def all_answers_submitted(game):
    answers = list(game.get_propositions())
    random.shuffle(answers)

    for idx, answer in enumerate(answers):
        answer.place = idx
        answer.save()

    events.all_answers_submitted(game, answers)


def select_answer(game, selected, selected_by):
    winner = selected.answered_by

    selected.selected_by = selected_by
    selected.save()

    turns_count = game.turns.count()
    turn = GameTurn(
        number=turns_count + 1,
        game=game,
        question_master=game.question_master,
        winner=winner,
        question=game.current_question,
    )
    turn.save()

    for answer in game.get_propositions():
        answer.turn = turn
        answer.save()

    events.answer_selected(game, turn)
