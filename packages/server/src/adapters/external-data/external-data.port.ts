import { Choice, Question } from 'src/entities';
import { createId } from 'src/utils/create-id';
import { factory } from 'src/utils/factory';

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
