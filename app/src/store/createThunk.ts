import { AppDispatch, AppGetState, AppThunk, Dependencies } from './types';

type ThunkOpts = {
  dispatch: AppDispatch;
  getState: AppGetState;
} & Dependencies;

export const createThunk = <T, A extends unknown[]>(
  thunk: (opts: ThunkOpts, ...args: A) => T,
): ((...args: A) => AppThunk<T>) => {
  return (...args) => {
    return (dispatch, getState, deps) => {
      return thunk({ dispatch, getState, ...deps }, ...args);
    };
  };
};
