import { AnyAction, Selector, ThunkAction } from '@reduxjs/toolkit';

import { Dependencies } from './dependencies';
import { createStore } from './store/create-store';

export type AppStore = ReturnType<typeof createStore>;
export type AppGetState = AppStore['getState'];
export type AppDispatch = AppStore['dispatch'];
export type AppState = ReturnType<AppGetState>;
export type AppSelector<Params extends unknown[], Result> = Selector<AppState, Result, Params>;
export type AppThunk<Result> = ThunkAction<Result, AppState, Dependencies, AnyAction>;
