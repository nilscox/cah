// @flow

import * as React from 'react';

import type {
  FullPlayerType,
  GameType,
  ChoiceType,
  ErrorType,
} from './models';

type SettingsType = {|
  darkMode: boolean,
|};

type FetchingType = {|
  player: boolean,
  game: boolean,
|};

type StatusType = {|
  appInitializing: boolean,
  api: string,
  websocket: string,
|};

export type State = {|
  player: FullPlayerType,
  game: GameType,
  selection: Array<ChoiceType>,
  settings: SettingsType,
  fetching: FetchingType,
  status: StatusType,
  error: ErrorType,
|};
