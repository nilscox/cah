import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { ThunkResult } from './createAction';
import { AppState, Dependencies } from './types';

type ThunkOpts = {
  dispatch: ThunkDispatch<AppState, Dependencies, Action<any>>;
  getState: () => AppState;
} & Dependencies;

export const createThunk = <T, A extends any[]>(
  thunk: (opts: ThunkOpts, ...args: A) => T,
): ((...args: A) => ThunkResult<T>) => {
  return (...args) => {
    return (dispatch, getState, deps) => {
      return thunk({ dispatch, getState, ...deps }, ...args);
    };
  };
};
