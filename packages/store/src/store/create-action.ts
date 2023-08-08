import { Action } from 'redux';

export interface ActionCreator<Type, Args extends unknown[], Payload> {
  (...args: Args): Action<Type> & Payload;
  type: Type;
}

export const createAction = <Type, Args extends unknown[], Payload>(
  type: Type,
  prepare: (...args: Args) => Payload,
) => {
  const actionCreator: ActionCreator<Type, Args, Payload> = (...args: Args) => ({
    type,
    ...prepare(...args),
  });

  actionCreator.type = type;

  return actionCreator;
};
