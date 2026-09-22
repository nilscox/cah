import { createId, factory } from '@cah/utils';

import { type Choice, type Question } from 'src/entities';

export type QuestionData = Pick<Question, 'text' | 'blanks'>;
export type ChoiceData = Pick<Choice, 'text' | 'caseSensitive'>;

export const createQuestionData = factory<QuestionData>(() => ({
  id: createId(),
  text: '',
}));

export interface ExternalDataPort {
  getQuestions(count: number): Promise<QuestionData[]>;
  getChoices(count: number): Promise<ChoiceData[]>;
}
