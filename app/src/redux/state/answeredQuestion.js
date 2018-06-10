// @flow

import type { Question } from './question';
import type { Choice } from './choice';

export type AnsweredQuestion = {
  id: number,
  question: Question,
  text: string,
  split: Array<?string>,
  answers: Array<Choice>,
  answered_by: string,
};