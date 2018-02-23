// @flow

import type {
  PlayerType,
  GameType,
  ChoiceType,
  PartialAnsweredQuestionType,
  AnsweredQuestionType,
} from './models';

export type WSConnectedEvent = {
  type: 'WS_CONNECTED',
  player: PlayerType,
};

export type WSDisconnectedEvent = {
  type: 'WS_DISCONNECTED',
  nick: string,
};

export type WSJoinedEvent = {
  type: 'WS_JOINED',
  player: PlayerType,
};

export type WSLeftEvent = {
  type: 'WS_LEFT',
  nick: PlayerType,
};

export type WSCardsDealtEvent = {
  type: 'WS_CARDS_DEALT',
  cards: Array<ChoiceType>,
};

export type WSGameStartedEvent = {
  type: 'WS_GAME_STARTED',
  game: GameType,
};

export type WSAnswereSubmittedEvent = {
  type: 'WS_ANSWER_SUBMITTED',
  nick: string,
};

export type WSAllAnswersSubmittedEvent = {
  type: 'WS_ALL_ANSWERS_SUBMITTED',
  answers: Array<PartialAnsweredQuestionType>,
};

export type WSAnswerSelectedEvent = {
  type: 'WS_ANSWER_SELECTED',
  answer: AnsweredQuestionType,
  answers: Array<AnsweredQuestionType>,
};

export type WSNextTurnEvent = {
  type: 'WS_NEXT_TURN',
  game: GameType,
};

export type WSEvent =
  | WSConnectedEvent
  | WSConnectedEvent
  | WSDisconnectedEvent
  | WSJoinedEvent
  | WSLeftEvent
  | WSCardsDealtEvent
  | WSGameStartedEvent
  | WSAnswereSubmittedEvent
  | WSAllAnswersSubmittedEvent
  | WSAnswerSelectedEvent
  | WSNextTurnEvent;
