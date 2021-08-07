import { ThunkMiddleware } from 'redux-thunk';

import { Actions } from '../domain/actions';
import { GameGateway } from '../domain/gateways/GameGateway';
import { NetworkGateway } from '../domain/gateways/NetworkGateway';
import { PlayerGateway } from '../domain/gateways/PlayerGateway';
import { RouterGateway } from '../domain/gateways/RouterGateway';
import { RTCGateway } from '../domain/gateways/RTCGateway';
import { ServerGateway } from '../domain/gateways/ServerGateway';
import { TimerGateway } from '../domain/gateways/TimerGateway';

import { configureStore } from './configureStore';
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
  timerGateway: TimerGateway;
  networkGateway: NetworkGateway;
  serverGateway: ServerGateway;
};

export type AppStore = ReturnType<typeof configureStore>;
export type AppDispatch = AppStore['dispatch'];

export type AppThunkMiddleware = ThunkMiddleware<AppState, AppAction, Dependencies>;

export type AppActionOrThunk = () => Parameters<AppDispatch>[0];
