import { Selector, ThunkAction } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

import { Actions } from '../domain/actions';
import { GameGateway } from '../domain/gateways/GameGateway';
import { NetworkGateway } from '../domain/gateways/NetworkGateway';
import { PersistenceGateway } from '../domain/gateways/PersistenceGateway';
import { PlayerGateway } from '../domain/gateways/PlayerGateway';
import { RouterGateway } from '../domain/gateways/RouterGateway';
import { RTCGateway } from '../domain/gateways/RTCGateway';
import { ServerGateway } from '../domain/gateways/ServerGateway';
import { TimerGateway } from '../domain/gateways/TimerGateway';

import { createStore } from './configureStore';

export type Nullable<T> = T | null;
export type NotNull<T> = T extends null ? never : T;

export type AppAction = Actions;

export type Dependencies = {
  playerGateway: PlayerGateway;
  gameGateway: GameGateway;
  rtcGateway: RTCGateway;
  routerGateway: RouterGateway;
  timerGateway: TimerGateway;
  networkGateway: NetworkGateway;
  serverGateway: ServerGateway;
  persistenceGateway: PersistenceGateway;
};

export type AppStore = ReturnType<typeof createStore>;

export type AppGetState = AppStore['getState'];
export type AppDispatch = AppStore['dispatch'];

export type AppState = ReturnType<AppGetState>;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, Dependencies, AnyAction>;

export type AppActionOrThunk = () => Parameters<AppDispatch>[0];

export type AppSelector<Result, Params extends unknown[]> = Selector<AppState, Result, Params>;
