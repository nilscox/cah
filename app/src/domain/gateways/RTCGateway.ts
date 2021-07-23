import { PlayState } from '../entities/Game';
import { Question } from '../entities/Question';

type PlayerConnected = {
  type: 'PlayerConnected';
  player: string;
};

type PlayerDisconnected = {
  type: 'PlayerDisconnected';
  player: string;
};

type GameJoined = {
  type: 'GameJoined';
};

type PlayerAnswered = {
  type: 'PlayerAnswered';
};

type GameStarted = {
  type: 'GameStarted';
};

type GameFinished = {
  type: 'GameFinished';
};

type TurnStarted = {
  type: 'TurnStarted';
  playState: PlayState;
  question: Question;
  questionMaster: string;
};

type TurnFinished = {
  type: 'TurnFinished';
};

type AllPlayersAnswered = {
  type: 'AllPlayersAnswered';
};

type WinnerSelected = {
  type: 'WinnerSelected';
};

type CardsDealt = {
  type: 'CardsDealt';
};

export type RTCMessage =
  | PlayerConnected
  | PlayerDisconnected
  | GameStarted
  | GameJoined
  | PlayerAnswered
  | GameFinished
  | TurnStarted
  | TurnFinished
  | AllPlayersAnswered
  | WinnerSelected
  | CardsDealt;

export type RTCListener = (message: RTCMessage) => void;

export interface RTCGateway {
  connect(): Promise<void>;
  onMessage(listener: RTCListener): void;
}
