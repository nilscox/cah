import { AllPlayersAnsweredEvent } from './AllPlayersAnsweredEvent';
import { CardsDealtEvent } from './CardsDealtEvent';
import { GameCreatedEvent } from './GameCreatedEvent';
import { GameFinishedEvent } from './GameFinishedEvent';
import { GameJoinedEvent } from './GameJoinedEvent';
import { GameStartedEvent } from './GameStartedEvent';
import { PlayerAnsweredEvent } from './PlayerAnsweredEvent';
import { TurnFinishedEvent } from './TurnFinishedEvent';
import { TurnStartedEvent } from './TurnStartedEvent';
import { WinnerSelectedEvent } from './WinnerSelectedEvent';

export type GameEvent =
  | GameCreatedEvent
  | GameJoinedEvent
  | GameStartedEvent
  | GameFinishedEvent
  | TurnStartedEvent
  | TurnFinishedEvent
  | PlayerAnsweredEvent
  | AllPlayersAnsweredEvent
  | WinnerSelectedEvent;

export type PlayerEvent = CardsDealtEvent;
