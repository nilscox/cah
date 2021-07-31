import { createAction } from '../store/createAction';
import { ServerStatus } from '../store/reducers/appStateReducer';

import { Choice } from './entities/Choice';
import { Game } from './entities/Game';
import { FullPlayer } from './entities/Player';
import { Turn } from './entities/Turn';
import { RTCMessage } from './gateways/RTCGateway';

export const setPlayer = createAction<FullPlayer, 'player/set'>('player/set');
export const setConnected = createAction('player/set-connected');
export const setPlayerCards = createAction<Choice[], 'player/set-cards'>('player/set-cards');
export const selectionValidated = createAction('player/selection-validated');

export const setGame = createAction<Game | null, 'game/set'>('game/set');
export const setTurns = createAction<Turn[], 'game/set-turns'>('game/set-turns');

export const gameStarted = createAction('game/started');

export const setAppReady = createAction('app/ready');
export const serverStatusChanged = createAction<ServerStatus, 'server/status'>('server/status');

export const rtcMessage = createAction<RTCMessage, 'rtc/message'>('rtc/message');

export const choiceSelected = createAction<Choice, 'choice/selected'>('choice/selected');
export const choiceUnselected = createAction<Choice, 'choice/unselected'>('choice/unselected');

export const log = createAction<unknown, 'debug/log'>('debug/log');

export type Actions = ReturnType<
  | typeof setPlayer
  | typeof setConnected
  | typeof setPlayerCards
  | typeof selectionValidated
  | typeof setGame
  | typeof setTurns
  | typeof setAppReady
  | typeof serverStatusChanged
  | typeof rtcMessage
  | typeof choiceSelected
  | typeof choiceUnselected
  | typeof log
>;
