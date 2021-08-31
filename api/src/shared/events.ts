import { AnswerDto, ChoiceDto, PlayerDto, PlayerId, QuestionDto } from './dtos';
import { PlayState } from './enums';

export interface PlayerConnectedEvent {
  type: 'PlayerConnected';
  player: PlayerId;
}

export interface PlayerDisconnectedEvent {
  type: 'PlayerDisconnected';
  player: PlayerId;
}

export interface GameJoinedEvent {
  type: 'GameJoined';
  player: PlayerDto;
}

export interface GameLeftEvent {
  type: 'GameLeft';
  player: PlayerId;
}

export interface GameStartedEvent {
  type: 'GameStarted';
  totalQuestions: number;
}

export interface TurnStartedEvent {
  type: 'TurnStarted';
  playState: PlayState.playersAnswer;
  question: QuestionDto;
  questionMaster: PlayerId;
}

export interface PlayerAnsweredEvent {
  type: 'PlayerAnswered';
  player: PlayerId;
}

export interface AllPlayersAnsweredEvent {
  type: 'AllPlayersAnswered';
  answers: AnswerDto[];
}

export interface WinnerSelectedEvent {
  type: 'WinnerSelected';
  winner: PlayerId;
  answers: AnswerDto[];
}

export interface TurnFinishedEvent {
  type: 'TurnFinished';
}

export interface GameFinishedEvent {
  type: 'GameFinished';
}

export interface CardsDealtEvent {
  type: 'CardsDealt';
  cards: ChoiceDto[];
}

export type GameEventDto =
  | PlayerConnectedEvent
  | PlayerDisconnectedEvent
  | GameJoinedEvent
  | GameLeftEvent
  | GameStartedEvent
  | TurnStartedEvent
  | PlayerAnsweredEvent
  | AllPlayersAnsweredEvent
  | WinnerSelectedEvent
  | TurnFinishedEvent
  | GameFinishedEvent;

export type PlayerEventDto = CardsDealtEvent;

export type EventDto = GameEventDto | PlayerEventDto;
