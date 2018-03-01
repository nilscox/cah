// @flow

import type {
  PlayerType,
  GameType,
  ChoiceType,
  PartialAnsweredQuestionType,
  AnsweredQuestionType,
} from './models';

export type WSConnectedMessage = {
  type: 'WS_CONNECTED',
  player: PlayerType,
};

export type WSDisconnectedMessage = {
  type: 'WS_DISCONNECTED',
  nick: string,
};

export type WSJoinedMessage = {
  type: 'WS_JOINED',
  player: PlayerType,
};

export type WSLeftMessage = {
  type: 'WS_LEFT',
  nick: PlayerType,
};

export type WSCardsDealtMessage = {
  type: 'WS_CARDS_DEALT',
  cards: Array<ChoiceType>,
};

export type WSGameStartedMessage = {
  type: 'WS_GAME_STARTED',
  game: GameType,
};

export type WSAnswereSubmittedMessage = {
  type: 'WS_ANSWER_SUBMITTED',
  nick: string,
};

export type WSAllAnswersSubmittedMessage = {
  type: 'WS_ALL_ANSWERS_SUBMITTED',
  answers: Array<PartialAnsweredQuestionType>,
};

export type WSAnswerSelectedMessage = {
  type: 'WS_ANSWER_SELECTED',
  answer: AnsweredQuestionType,
  answers: Array<AnsweredQuestionType>,
};

export type WSNextTurnMessage = {
  type: 'WS_NEXT_TURN',
  game: GameType,
};

export type WSMessage =
  | WSConnectedMessage
  | WSConnectedMessage
  | WSDisconnectedMessage
  | WSJoinedMessage
  | WSLeftMessage
  | WSCardsDealtMessage
  | WSGameStartedMessage
  | WSAnswereSubmittedMessage
  | WSAllAnswersSubmittedMessage
  | WSAnswerSelectedMessage
  | WSNextTurnMessage;
