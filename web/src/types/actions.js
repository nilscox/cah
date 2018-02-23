// @flow

import type { State } from './state';
import type { WSEvent } from './events';
import type { ChoiceType } from './models';

export type Dispatch = (action: Action | ThunkAction | PromiseAction) => any;
export type GetState = () => State;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;
export type RequestAction = ThunkAction;
export type RequestStateAction = { type: string };

export type GenericAction = {
  type: string,
};

export type ClearErrorAction = {
  type: string,
  reason: string,
};

export type GameToggleChoiceAction = {|
  type: 'GAME_TOGGLE_CHOICE',
  choice: ChoiceType,
|};

export type WebsocketCreatedAction = {|
  type: 'WEBSOCKET_CREATED',
|};

export type WebsocketConnectedAction = {|
  type: 'WEBSOCKET_CONNECTED',
  event: any,
|};

export type WebsocketMessageAction = {|
  type: string,
  message: WSEvent,
|};

export type WebsocketClosedAction = {|
  type: 'WEBSOCKET_CLOSED',
|};

export type Action =
  | ThunkAction
  | PromiseAction

  | RequestAction
  | RequestStateAction
  | GenericAction

  | ClearErrorAction
  | GameToggleChoiceAction
  | WebsocketCreatedAction
  | WebsocketConnectedAction
  | WebsocketMessageAction
  | WebsocketClosedAction;
