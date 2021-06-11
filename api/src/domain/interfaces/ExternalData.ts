import { Token } from 'typedi';

import { Choice } from '../entities/Choice';
import { Question } from '../entities/Question';

export const ExternalDataToken = new Token<ExternalData>('ExternalData');

export interface ExternalData {
  pickRandomQuestions(count: number): Promise<Question[]>;
  pickRandomChoices(count: number): Promise<Choice[]>;
}
