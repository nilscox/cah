import { AllPlayersAnsweredEvent } from './AllPlayersAnsweredEvent';
import { CardsDealtEvent } from './CardsDealtEvent';
import { GameCreatedEvent } from './GameCreatedEvent';
import { GameFinishedEvent } from './GameFinishedEvent';
import { GameJoinedEvent } from './GameJoinedEvent';
import { GameLeftEvent } from './GameLeftEvent';
import { GameStartedEvent } from './GameStartedEvent';
import { PlayerAnsweredEvent } from './PlayerAnsweredEvent';
import { PlayerConnectedEvent } from './PlayerConnectedEvent';
import { PlayerDisconnectedEvent } from './PlayerDisconnectedEvent';
import { TurnFinishedEvent } from './TurnFinishedEvent';
import { TurnStartedEvent } from './TurnStartedEvent';
import { WinnerSelectedEvent } from './WinnerSelectedEvent';

export type GameEvent =
  | PlayerConnectedEvent
  | PlayerDisconnectedEvent
  | GameCreatedEvent
  | GameJoinedEvent
  | GameLeftEvent
  | GameStartedEvent
  | GameFinishedEvent
  | TurnStartedEvent
  | TurnFinishedEvent
  | PlayerAnsweredEvent
  | AllPlayersAnsweredEvent
  | WinnerSelectedEvent;

export type PlayerEvent = CardsDealtEvent;

export type DomainEvent = GameEvent | PlayerEvent;
