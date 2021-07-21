import { Game } from '../interfaces/entities/Game';
import { Player } from '../interfaces/entities/Player';
import { RTCMessage } from '../interfaces/gateways/RTCGateway';
import { createAction } from '../store/createAction';

export const setPlayer = createAction<Player, 'player/set'>('player/set');
export const setConnected = createAction('player/set-connected');

export const setGame = createAction<Game, 'game/set'>('game/set');

export const setAppReady = createAction('app/ready');

export const rtcMessage = createAction<RTCMessage, 'rtc/message'>('rtc/message');

export const log = createAction<unknown, 'debug/log'>('debug/log');

export type Actions = ReturnType<
  typeof setPlayer | typeof setGame | typeof setAppReady | typeof setConnected | typeof rtcMessage | typeof log
>;
