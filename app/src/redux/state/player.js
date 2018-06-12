// @flow

import type { Choice } from './choice';
import type { AnsweredQuestion } from './answeredQuestion';

export type Player = {
  nick: string,
  connected: boolean,
  avatar: ?string,
  score?: number,
};

export type FullPlayer = Player & {
  cards?: Array<Choice>,
  submitted: ?AnsweredQuestion,

  selectedChoices: Array<?Choice>,
};
