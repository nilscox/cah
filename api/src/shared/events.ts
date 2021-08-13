import { AnonymousAnswerDto, AnswerDto, ChoiceDto, QuestionDto } from './dtos';
import { PlayState } from './enums';

export interface PlayerConnectedEvent {
  type: 'PlayerConnected';
  player: string;
}

export interface PlayerDisconnectedEvent {
  type: 'PlayerDisconnected';
  player: string;
}

export interface GameJoinedEvent {
  type: 'GameJoined';
  player: {
    id: string;
    nick: string;
    isConnected: boolean;
  };
}

export interface GameLeftEvent {
  type: 'GameLeft';
  player: string;
}

export interface GameStartedEvent {
  type: 'GameStarted';
}

export interface TurnStartedEvent {
  type: 'TurnStarted';
  playState: PlayState.playersAnswer;
  question: QuestionDto;
  questionMaster: string;
}

export interface PlayerAnsweredEvent {
  type: 'PlayerAnswered';
  player: string;
}

export interface AllPlayersAnsweredEvent {
  type: 'AllPlayersAnswered';
  answers: AnonymousAnswerDto[];
}

export interface WinnerSelectedEvent {
  type: 'WinnerSelected';
  winner: string;
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
