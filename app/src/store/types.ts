import { Store } from 'redux';
import { ThunkMiddleware } from 'redux-thunk';

import { setConnected } from '../domain/player/connect/connect';
import { setPlayer } from '../domain/player/login/login';
import { GameGateway } from '../interfaces/gateways/GameGateway';
import { PlayerGateway } from '../interfaces/gateways/PlayerGateway';
import { RTCGateway } from '../interfaces/gateways/RTCGateway';

import { PlayerState } from './reducers';

export type Nullable<T> = T | null;

export type AppState = {
  player: PlayerState;
};

export type AppAction = ReturnType<typeof setPlayer | typeof setConnected>;

export type Dependencies = {
  playerGateway: PlayerGateway;
  gameGateway: GameGateway;
  rtcGateway: RTCGateway;
};

export type AppStore = Store<AppState, AppAction>;
export type AppDispatch = AppStore['dispatch'];

export type AppThunkMiddleware = ThunkMiddleware<AppState, AppAction, Dependencies>;
