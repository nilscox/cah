import { Choice, Question } from 'src/entities';

export type QuestionData = Omit<Question, 'gameId'>;
export type ChoiceData = Omit<Choice, 'gameId' | 'place'>;

export interface ExternalDataPort {
  getQuestions(count: number): Promise<QuestionData[]>;
  getChoices(count: number): Promise<ChoiceData[]>;
}
