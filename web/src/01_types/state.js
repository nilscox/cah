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
  +showInstructions: boolean,
|};

export type FetchingType = {|
  +player: boolean,
  +game: boolean,
|};

export type StatusType = {|
  +fetching: FetchingType,
  +appInitializing: boolean,
  +api: string,
  +websocket: string,
|};

export type State = {|
  +player: FullPlayerType,
  +game: GameType,
  +settings: SettingsType,
  +status: StatusType,
  +error: ErrorType,
|};
