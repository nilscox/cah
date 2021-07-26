import { QuestionDto, AnonymousAnswerDto, AnswerDto, ChoiceDto } from "./dtos";
import { PlayState } from "./enums";

export interface PlayerConnectedEvent {
  type: "PlayerConnected";
  player: string;
}

export interface PlayerDisconnectedEvent {
  type: "PlayerDisconnected";
  player: string;
}

export interface GameJoinedEvent {
  type: "GameJoined";
  player: string;
}

export interface GameStartedEvent {
  type: "GameStarted";
}

export interface TurnStartedEvent {
  type: "TurnStarted";
  playState: PlayState.playersAnswer;
  question: QuestionDto;
  questionMaster: string;
}

export interface PlayerAnsweredEvent {
  type: "PlayerAnswered";
  player: string;
}

export interface AllPlayersAnsweredEvent {
  type: "AllPlayersAnswered";
  answers: AnonymousAnswerDto[];
}

export interface WinnerSelectedEvent {
  type: "WinnerSelected";
  winner: string;
  answers: AnswerDto[];
}

export interface TurnFinishedEvent {
  type: "TurnFinished";
}

export interface GameFinishedEvent {
  type: "GameFinished";
}

export interface CardsDealtEvent {
  type: "CardsDealt";
  cards: ChoiceDto[];
}

export type EventDto =
  | PlayerConnectedEvent
  | PlayerDisconnectedEvent
  | GameJoinedEvent
  | GameStartedEvent
  | TurnStartedEvent
  | PlayerAnsweredEvent
  | AllPlayersAnsweredEvent
  | WinnerSelectedEvent
  | TurnFinishedEvent
  | GameFinishedEvent
  | CardsDealtEvent;