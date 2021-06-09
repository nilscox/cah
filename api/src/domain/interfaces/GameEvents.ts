import { Token } from 'typedi';

import { Answer } from '../entities/Answer';
import { Choice } from '../entities/Choice';
import { Game } from '../entities/Game';
import { Player } from '../entities/Player';
import { Question } from '../entities/Question';
import { Turn } from '../entities/Turn';

export const GameEventsToken = new Token('GameEvents');

export type PlayerJoined = {
  type: 'PlayerJoined';
  player: Player;
};

export type GameStarted = {
  type: 'GameStarted';
};

export type TurnStarted = {
  type: 'TurnStarted';
  questionMaster: Player;
  question: Question;
};

export type PlayerAnswered = {
  type: 'PlayerAnswered';
  player: Player;
};

export type AllPlayersAnswered = {
  type: 'AllPlayersAnswered';
  answers: Answer[];
};

export type WinnerSelected = {
  type: 'WinnerSelected';
  answers: Answer[];
  winner: Player;
};

export type TurnEnded = {
  type: 'TurnEnded';
  turn: Turn;
};

export type GameFinished = {
  type: 'GameFinished';
};

export type GameEvent =
  | PlayerJoined
  | GameStarted
  | TurnStarted
  | PlayerAnswered
  | AllPlayersAnswered
  | WinnerSelected
  | TurnEnded
  | GameFinished;

type CardsDealt = {
  type: 'CardsDealt';
  cards: Choice[];
};

export type PlayerEvent = CardsDealt;

export interface GameEvents {
  onPlayerEvent(player: Player, event: PlayerEvent): void;
  onGameEvent(game: Game, event: GameEvent): void;
}
