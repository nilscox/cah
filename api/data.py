import os
import json


QUESTIONS_PATH = os.environ['QUESTIONS_PATH']
CHOICES_PATH = os.environ['CHOICES_PATH']


def load_json(path):
    with open(path) as f:
        return json.loads(f.read())


def get_questions():
    questions = load_json(QUESTIONS_PATH)
    return [q[0] for q in questions], [q[1] for q in questions]


def get_choices():
    return load_json(CHOICES_PATH)
