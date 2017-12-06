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


class GameAlreadyStarted(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = 'GAME_ALREADY_STARTED'
    default_detail = 'Game has already started'


class GameNotStarted(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = 'GAME_NOT_STARTED'
    default_detail = 'Game is not started'


class PlayerCurrentPlayer(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = 'PLAYER_IS_CURRENT'
    default_detail = 'Player is the current player'


class PlayerNotCurrentPlayer(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = 'PLAYER_IS_NOT_CURRENT'
    default_detail = 'Player is not the current player'


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
