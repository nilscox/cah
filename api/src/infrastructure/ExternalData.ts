import { Choice } from '../domain/models/Choice';
import { Question } from '../domain/models/Question';

export interface ExternalData {
  pickRandomQuestions(count: number): Promise<Question[]>;
  pickRandomChoices(count: number): Promise<Choice[]>;
}
