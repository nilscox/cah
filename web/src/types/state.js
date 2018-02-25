// @flow

import * as React from 'react';

import type {
  FullPlayerType,
  GameType,
  GameTurnType,
  ChoiceType,
  ErrorType,
} from './models';

export type SettingsType = {|
  +darkMode: boolean,
|};

export type FetchingType = {|
  +player: boolean,
  +game: boolean,
|};

export type StatusType = {|
  +appInitializing: boolean,
  +api: string,
  +websocket: string,
|};

export type State = {|
  +player: FullPlayerType,
  +game: GameType,
  +gameHistory: Array<GameTurnType>,
  +selection: Array<ChoiceType>,
  +settings: SettingsType,
  +fetching: FetchingType,
  +status: StatusType,
  +error: ErrorType,
|};
