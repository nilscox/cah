import { createAsyncThunk } from '@reduxjs/toolkit';

import { Dependencies } from '../dependencies';
import { AppDispatch, AppGetState, AppState } from '../types';

type ThunkApi = {
  getState: AppGetState;
  dispatch: AppDispatch;
};

type AsyncThunkConfig = {
  state: AppState;
  dispatch: AppDispatch;
  extra: Dependencies;
};

export function createThunk<Params extends unknown[] = [], Result = void>(
  typePrefix: string,
  thunk: (api: ThunkApi & Dependencies, ...params: Params) => Result,
) {
  const thunkAction = createAsyncThunk<Result, Params, AsyncThunkConfig>(typePrefix, (params, thunkApi) => {
    return thunk({ ...thunkApi, ...thunkApi.extra }, ...params);
  });

  return (...params: Params) => {
    return thunkAction(params);
  };
}
