import { Token } from 'typedi';

import { Answer } from '../entities/Answer';
import { Choice } from '../entities/Choice';
import { Game } from '../entities/Game';
import { Player } from '../entities/Player';
import { Question } from '../entities/Question';
import { Turn } from '../entities/Turn';

export const GameEventsToken = new Token('GameEvents');

type PlayerJoined = {
  type: 'PlayerJoined';
  player: Player;
};

type GameStarted = {
  type: 'GameStarted';
};

type TurnStarted = {
  type: 'TurnStarted';
  questionMaster: Player;
  question: Question;
};

type PlayerAnswered = {
  type: 'PlayerAnswered';
  player: Player;
};

type AllPlayersAnswered = {
  type: 'AllPlayersAnswered';
  answers: Answer[];
};

type WinnerSelected = {
  type: 'WinnerSelected';
  answers: Answer[];
  winner: Player;
};

type TurnEnded = {
  type: 'TurnEnded';
  turn: Turn;
};

type GameFinished = {
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
  emit(game: Game, to: Player, event: PlayerEvent): Promise<void>;
  broadcast(game: Game, event: GameEvent): void;
}
