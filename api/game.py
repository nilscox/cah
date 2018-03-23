import random

from api import data, events
from api.exceptions import *
from api.models import Question, Blank, Choice, AnsweredQuestion, GameTurn

MIN_PLAYERS_TO_START = 2


def init(game):
    data_questions, data_places = data.get_questions()
    data_choices = data.get_choices()

    def create_questions():
        questions = list(map(lambda text: Question(game=game, text=text), data_questions))
        Question.objects.bulk_create(questions)

    def create_blanks():
        questions = list(game.questions.all())
        blanks = []

        for i in range(len(questions)):
            for place in data_places[i]:
                blanks.append(Blank(question=questions[i], place=place))

        Blank.objects.bulk_create(blanks)

    def create_choices():
        choices = map(lambda text: Choice(game=game, text=text), data_choices)
        Choice.objects.bulk_create(choices)

    create_questions()
    create_blanks()
    create_choices()

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

    blanks = list(question.blanks.all())

    for i in range(len(choices)):
        choice = choices[i]

        answered_question.answers.create(position=blanks[i], choice=choice)

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
