import {
  AllPlayersAnsweredEvent,
  CardsDealtEvent,
  GameFinishedEvent,
  GameJoinedEvent,
  GameLeftEvent,
  GameStartedEvent,
  PlayerAnsweredEvent,
  PlayerConnectedEvent,
  PlayerDisconnectedEvent,
  TurnFinishedEvent,
  TurnStartedEvent,
  WinnerSelectedEvent,
} from '../../../../../../shared/events';
import { createThunk } from '../../../../store/createThunk';
import { AppThunk } from '../../../../store/types';
import { RTCMessage } from '../../../gateways/RTCGateway';
import { handleAllPlayersAnswered } from '../handleAllPlayersAnswered/handleAllPlayersAnswered';
import { handleCardsDealt } from '../handleCardsDealt/handleCardsDealt';
import { handleGameFinished } from '../handleGameFinished/handleGameFinished';
import { handleGameJoined } from '../handleGameJoined/handleGameJoined';
import { handleGameLeft } from '../handleGameLeft/handleGameLeft';
import { handleGameStarted } from '../handleGameStarted/handleGameStarted';
import { handlePlayerConnected } from '../handlePlayerConnected/handlePlayerConnected';
import { handlePlayerDisconnected } from '../handlePlayerDisconnected/handlePlayerDisconnected';
import { handleTurnFinished } from '../handleTurnFinished/handleTurnFinished';
import { handleTurnStarted } from '../handleTurnStarted/handleTurnStarted';
import { handleWinnerSelected } from '../handleWinnerSelected/handleWinnerSelected';

const noop = () => () => {
  // nope
};

type EventsMap = {
  CardsDealt: CardsDealtEvent;
  PlayerConnected: PlayerConnectedEvent;
  PlayerDisconnected: PlayerDisconnectedEvent;
  GameJoined: GameJoinedEvent;
  GameLeft: GameLeftEvent;
  GameStarted: GameStartedEvent;
  TurnStarted: TurnStartedEvent;
  PlayerAnswered: PlayerAnsweredEvent;
  AllPlayersAnswered: AllPlayersAnsweredEvent;
  WinnerSelected: WinnerSelectedEvent;
  TurnFinished: TurnFinishedEvent;
  GameFinished: GameFinishedEvent;
};

const handlers: { [Type in RTCMessage['type']]: (message: EventsMap[Type]) => AppThunk } = {
  CardsDealt: handleCardsDealt,
  PlayerConnected: handlePlayerConnected,
  PlayerDisconnected: handlePlayerDisconnected,
  GameJoined: handleGameJoined,
  GameLeft: handleGameLeft,
  GameStarted: handleGameStarted,
  TurnStarted: handleTurnStarted,
  PlayerAnswered: noop,
  AllPlayersAnswered: handleAllPlayersAnswered,
  WinnerSelected: handleWinnerSelected,
  TurnFinished: handleTurnFinished,
  GameFinished: handleGameFinished,
};

export const handleRTCMessage = createThunk(({ dispatch }, message: RTCMessage) => {
  if (!(message.type in handlers)) {
    throw new Error(`handleRTCMessage: no handler for event ${message.type}`);
  }

  // ts code smell
  const handler = handlers[message.type] as (message: RTCMessage) => AppThunk;

  dispatch(handler(message));
});
