// @flow

import type {
  FetchGameAction,
  FetchGameHistoryAction,
} from './game';

export type Action =
  | FetchGameAction
  | FetchGameHistoryAction;
