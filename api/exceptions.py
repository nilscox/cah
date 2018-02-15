from rest_framework import status
from rest_framework.exceptions import APIException


class PlayerNotFound(APIException):
    status_code = status.HTTP_404_NOT_FOUND
    default_code = 'PLAYER_NOT_FOUND'
    default_detail = 'Player not found'


class PlayerAlreadyInGame(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = 'PLAYER_ARLEADY_IN_GAME'
    default_detail = 'Player is already in a game'


class PlayerNotInGame(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = 'PLAYER_NOT_IN_GAME'
    default_detail = 'Player did not join a game'


class PlayerNotGameOwner(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = 'PLAYER_NOT_OWNER'
    default_detail = 'Player is not the owner of this game'


class GameNotFound(APIException):
    status_code = 404
    default_code = 'GAME_NOT_FOUND'
    default_detail = 'Game not found'


class GameAlreadyStarted(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = 'GAME_ALREADY_STARTED'
    default_detail = 'Game has already started'


class GameNotStarted(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = 'GAME_NOT_STARTED'
    default_detail = 'Game is not started'


class PlayerQuestionMaster(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = 'PLAYER_IS_QUESTION_MASTER'
    default_detail = 'Player is the question master'


class PlayerNotQuestionMaster(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = 'PLAYER_IS_NOT_QUESTION_MASTER'
    default_detail = 'Player is not the question master'


class PlayerAlreadyAnswered(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = 'PLAYER_ALREADY_ANSWERED'
    default_detail = 'Player has already submitted an answer'


class PlayerCantSelectAnswer(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = 'PLAYER_CANT_SELECT_ANSWERED'
    default_detail = 'Player can\'t select an answer'


class InvalidAnswersCount(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = 'INVALID_ANSWERS_COUNT'
    default_detail = 'Invalid amount of answers'


class InvalidAnswers(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = 'INVALID_ANSWERS'
    default_detail = 'Invalid answers'


class InvalidSelection(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = 'INVALID_SELECTION'
    default_detail = 'Invalid selection'


class NoMoreQuestions(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = 'NO_MORE_QUESTIONS'
    default_detail = 'No more questions available'


class NoMoreChoices(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = 'NO_MORE_CHOICES'
    default_detail = 'No more choices available'


class NotEnoughPlayers(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = 'NOT_ENOUGH_PLAYERS'
    default_detail = 'Not enough players to start the game'


class TurnNotOver(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = 'TURN_NOT_OVER'
    default_detail = 'Turn is not over'
