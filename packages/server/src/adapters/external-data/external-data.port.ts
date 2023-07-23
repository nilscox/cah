import { Choice, Question } from 'src/entities';

export type QuestionData = Pick<Question, 'text' | 'blanks'>;
export type ChoiceData = Pick<Choice, 'text' | 'caseSensitive'>;

export interface ExternalDataPort {
  getQuestions(count: number): Promise<QuestionData[]>;
  getChoices(count: number): Promise<ChoiceData[]>;
}
