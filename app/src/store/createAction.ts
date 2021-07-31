import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { AppState, Dependencies } from './types';

type ActionWithPayload<Payload, Type> = Action<Type> & {
  payload: Payload;
};

type PayloadActionCreator<P = void, T extends string = string> = (
  payload: P,
) => P extends void ? Action<T> : ActionWithPayload<P, T>;

export function createAction<P = void, T extends string = string>(type: T): PayloadActionCreator<P, T>;
export function createAction<P, T extends string>(type: T) {
  return (payload?: P) => {
    if (payload !== undefined) {
      return { type, payload };
    } else {
      return { type };
    }
  };
}

export type ThunkResult<R> = ThunkAction<R, AppState, Dependencies, Action>;
