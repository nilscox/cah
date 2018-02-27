// @flow

import type { State } from './state';
import type { WSMessage } from './websocket';
import type { ChoiceType } from './models';
import { ApiRequestError } from '../request';

export type Dispatch = (action: Action | RequestAction | ThunkAction | PromiseAction) => any;
export type GetState = () => State;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;

export type ClearErrorAction = {
  type: 'CLEAR_ERROR',
  reason: string,
};

export type CheckApiStatusAction = {
  type: 'CHECK_API_STATUS',
  reason?: string,
};

export type ApiDownAction = {
  type: 'API_DOWN',
};

export type ApiUpAction = {
  type: 'API_UP',
};

export type InitializationStartedAction = {
  type: 'INITIALIZATION_STARTED',
};

export type InitializationFinishedAction = {
  type: 'INITIALIZATION_FINISHED',
};

export type GameToggleChoiceAction = {
  type: 'GAME_TOGGLE_CHOICE',
  choice: ChoiceType,
};

export type WebsocketCreatedAction = {
  type: 'WEBSOCKET_CREATED',
};

export type WebsocketConnectedAction = {
  type: 'WEBSOCKET_CONNECTED',
  event: any,
};

export type WebsocketMessageAction = {
  type: 'WEBSOCKET_MESSAGE',
  message: WSMessage,
};

export type WebsocketClosedAction = {
  type: 'WEBSOCKET_CLOSED',
};

export type Action =
  | ClearErrorAction
  | CheckApiStatusAction
  | ApiDownAction
  | ApiUpAction
  | InitializationStartedAction
  | InitializationFinishedAction
  | GameToggleChoiceAction
  | WebsocketCreatedAction
  | WebsocketConnectedAction
  | WebsocketMessageAction
  | WebsocketClosedAction;

export type RequestStartAction = {
  type: string,
  method: string,
  route: string,
  body?: any,
};

export type RequestSuccessAction = {
  type: string,
  status: number,
  body: any,
};

export type RequestFailureAction = {
  type: string,
  error: ApiRequestError,
};

export type RequestAction =
  | RequestStartAction
  | RequestSuccessAction
  | RequestFailureAction;
