import { Choice } from '../models/Choice';
import { Question } from '../models/Question';

export interface ExternalData {
  pickRandomQuestions(count: number): Promise<Question[]>;
  pickRandomChoices(count: number): Promise<Choice[]>;
}
