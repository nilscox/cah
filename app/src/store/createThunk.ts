import { ThunkDispatch } from 'redux-thunk';

import { ThunkResult } from './createAction';
import { AppAction, AppState, Dependencies } from './types';

type ThunkOpts = {
  dispatch: ThunkDispatch<AppState, Dependencies, AppAction>;
  getState: () => AppState;
} & Dependencies;

export const createThunk = <T, A extends unknown[]>(
  thunk: (opts: ThunkOpts, ...args: A) => T,
): ((...args: A) => ThunkResult<T>) => {
  return (...args) => {
    return (dispatch, getState, deps) => {
      return thunk({ dispatch, getState, ...deps }, ...args);
    };
  };
};
