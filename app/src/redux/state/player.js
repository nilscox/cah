// @flow

import type { Choice } from './choice';
import type { AnsweredQuestion } from './answeredQuestion';

export type Player = {
  nick: string,
  connected: boolean,
  avatar: string,
  cards?: Array<Choice>,
  score?: number,
  submitted: ?AnsweredQuestion,

  selectedChoices: Array<?Choice>,
};
