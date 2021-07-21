import { ThunkMiddleware } from 'redux-thunk';

import { Actions } from '../domain/actions';
import { GameGateway } from '../interfaces/gateways/GameGateway';
import { PlayerGateway } from '../interfaces/gateways/PlayerGateway';
import { RouterGateway } from '../interfaces/gateways/RouterGateway';
import { RTCGateway } from '../interfaces/gateways/RTCGateway';

import { configureStore } from './index';
import { AppState as A, GameState, PlayerState } from './reducers';

export type Nullable<T> = T | null;

export type AppState = {
  player: PlayerState;
  game: GameState;
  app: A;
};

export type AppAction = Actions;

export type Dependencies = {
  playerGateway: PlayerGateway;
  gameGateway: GameGateway;
  rtcGateway: RTCGateway;
  routerGateway: RouterGateway;
};

export type AppStore = ReturnType<typeof configureStore>;
export type AppDispatch = AppStore['dispatch'];

export type AppThunkMiddleware = ThunkMiddleware<AppState, AppAction, Dependencies>;
