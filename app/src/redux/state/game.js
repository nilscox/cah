// @flow

import type { Player } from './player';
import type { Question } from './question';

type Proposition = {

};

export type GameTurn = {

};

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
  history: Array<GameTurn>,
};
