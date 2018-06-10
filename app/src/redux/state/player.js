// @flow

import type { Choice } from './choice';

export type Player = {
  nick: string,
  connected: boolean,
  avatar: string,
  cards?: Array<Choice>,
  score?: number,

  selectedChoices: Array<?Choice>,
};
