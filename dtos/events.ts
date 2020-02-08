import { PlayerDTO } from "dtos/player.dto";
import { ChoiceDTO } from "dtos/choice.dto";
import { GameDTO } from "dtos/game.dto";
import { AnswerDTO } from "dtos/answer.dto";
import { TurnDTO } from "dtos/turn.dto";

export type ConnectedEvent = {
  type: 'connected';
  nick: string;
};

export type DisconnectedEvent = {
  type: 'disconnected';
  nick: string;
};

export type JoinEvent = {
  type: 'join';
  player: PlayerDTO;
};

export type CardsEvent = {
  type: 'cards';
  cards: ChoiceDTO[];
};

export type StartEvent = {
  type: 'start';
  game: GameDTO;
};

export type AnswersEvent = {
  type: 'answer';
  nick: string;
};

export type AllAnswersEvent = {
  type: 'allanswers';
  answers: AnswerDTO[];
};

export type NextEvent = {
  type: 'next';
  game: GameDTO;
};

export type TurnEvent = {
  type: 'turn';
  turn: TurnDTO;
};

export type EndEvent = {
  type: 'end';
  game: GameDTO;
};

export type GameEvent =
  | ConnectedEvent
  | DisconnectedEvent
  | JoinEvent
  | CardsEvent
  | StartEvent
  | AnswersEvent
  | AllAnswersEvent
  | NextEvent
  | TurnEvent
  | EndEvent;
