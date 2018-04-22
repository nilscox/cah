// @flow

export type Action = {
  type: string,
  promise?: any,
  payload?: any,
  meta?: any,
};

export type Dispatch = Action => any;
