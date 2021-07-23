import { createAction } from '../store/createAction';
import { ServerStatus } from '../store/reducers/appStateReducer';

import { Game } from './entities/Game';
import { Player } from './entities/Player';
import { RTCMessage } from './gateways/RTCGateway';

export const setPlayer = createAction<Player, 'player/set'>('player/set');
export const setConnected = createAction('player/set-connected');

export const setGame = createAction<Game, 'game/set'>('game/set');

export const gameStarted = createAction('game/started');

export const setAppReady = createAction('app/ready');
export const serverStatusChanged = createAction<ServerStatus, 'server/status'>('server/status');

export const rtcMessage = createAction<RTCMessage, 'rtc/message'>('rtc/message');

export const log = createAction<unknown, 'debug/log'>('debug/log');

export type Actions = ReturnType<
  | typeof setPlayer
  | typeof setGame
  | typeof setAppReady
  | typeof serverStatusChanged
  | typeof setConnected
  | typeof rtcMessage
  | typeof log
>;
