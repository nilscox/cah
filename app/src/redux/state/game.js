// @flow

import type { Player } from './player';
import type { Question } from './question';
import type { Choice } from './choice';
import type { AnsweredQuestion } from './answeredQuestion';

type Proposition = {
  id: number,
  question: Question,
  text: string,
  split: Array<string>,
  answers: Array<Choice>,
};

export type GameTurn = {
  number: number,
  question_master: string,
  winner: string,
  question: Question,
  answers: Array<AnsweredQuestion>,
};

export type GameHistory = Array<GameTurn>;

export type Game = {
  id: number,
  lang: string,
  owner: string,
  play_state: string,
  players: Array<Player>,
  propositions: Array<Proposition>,
  question: Question,
  question_master: string,
  state: string,
  history: GameHistory,
};
