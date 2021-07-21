import { Game } from '../interfaces/entities/Game';
import { Player } from '../interfaces/entities/Player';
import { createAction } from '../store/createAction';

export const setPlayer = createAction<Player, 'player/set'>('player/set');
export const setConnected = createAction('player/set-connected');

export const setGame = createAction<Game, 'game/set'>('game/set');

export const setAppReady = createAction('app/ready');

export type Actions = ReturnType<typeof setPlayer | typeof setGame | typeof setAppReady | typeof setConnected>;
