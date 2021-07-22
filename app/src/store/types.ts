import { ThunkMiddleware } from 'redux-thunk';

import { Actions } from '../domain/actions';
import { GameGateway } from '../interfaces/gateways/GameGateway';
import { PlayerGateway } from '../interfaces/gateways/PlayerGateway';
import { RouterGateway } from '../interfaces/gateways/RouterGateway';
import { RTCGateway } from '../interfaces/gateways/RTCGateway';
import { ServerGateway } from '../interfaces/gateways/ServerGateway';
import { TimerGateway } from '../interfaces/gateways/TimerGateway';

import { configureStore } from './index';
import { AppState as StoreAppState } from './reducers/appStateReducer';
import { GameState } from './reducers/gameReducer';
import { PlayerState } from './reducers/playerReducer';

export type Nullable<T> = T | null;
export type NotNull<T> = T extends null ? never : T;

export type AppState = {
  player: PlayerState;
  game: GameState;
  app: StoreAppState;
};

export type AppAction = Actions;

export type Dependencies = {
  playerGateway: PlayerGateway;
  gameGateway: GameGateway;
  rtcGateway: RTCGateway;
  routerGateway: RouterGateway;
  gameRouterGateway: RouterGateway;
  timerGateway: TimerGateway;
  serverGateway: ServerGateway;
};

export type AppStore = ReturnType<typeof configureStore>;
export type AppDispatch = AppStore['dispatch'];

export type AppThunkMiddleware = ThunkMiddleware<AppState, AppAction, Dependencies>;
