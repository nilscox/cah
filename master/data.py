import os
import json


QUESTIONS_PATH = os.environ['QUESTIONS_PATH']
CHOICES_PATH = os.environ['CHOICES_PATH']


def load_json(path):
    with open(path) as f:
        return json.loads(f.read())


def get_questions():
    return load_json(QUESTIONS_PATH)


def get_choices():
    return load_json(CHOICES_PATH)
