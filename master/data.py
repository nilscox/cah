import os
import json


DATA_PATH = os.environ['CAH_DATA_PATH']


def load_json(path):
    with open(path) as f:
        return json.loads(f.read())


def get_questions(lang):
    return load_json(os.path.join(DATA_PATH, lang, 'questions.json'))


def get_choices(lang):
    return load_json(os.path.join(DATA_PATH, lang, 'choices.json'))
