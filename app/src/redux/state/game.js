// @flow

import type { Player } from './player';
import type { Question } from './question';
import type { AnsweredQuestion, FullAnsweredQuestion } from './answeredQuestion';

export type GameTurn = {
  number: number,
  question_master: string,
  winner: string,
  question: Question,
  answers: Array<FullAnsweredQuestion>,
};

export type GameHistory = Array<GameTurn>;

export type Game = {
  id: number,
  lang: string,
  owner: string,
  play_state: string,
  players: Array<Player>,
  propositions: Array<AnsweredQuestion>,
  question: Question,
  question_master: string,
  state: string,
  history: GameHistory,
};
