import { Choice } from '../../entities/Choice';
import { Question } from '../../entities/Question';
import { ExternalData } from '../../interfaces/ExternalData';
import { createChoices, createQuestions } from '../creators';

export class InMemoryExternalData implements ExternalData {
  async pickRandomQuestions(count: number): Promise<Question[]> {
    return createQuestions(count);
  }

  async pickRandomChoices(count: number): Promise<Choice[]> {
    return createChoices(count);
  }
}
