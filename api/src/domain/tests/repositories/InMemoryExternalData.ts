import { Choice } from '../../entities/Choice';
import { Question } from '../../entities/Question';
import { ExternalData } from '../../interfaces/ExternalData';
import { createChoices, createQuestions } from '../creators';

export class InMemoryExternalData implements ExternalData {
  private questions?: Question[];

  setQuestions(questions: Question[]) {
    this.questions = questions;
  }

  async pickRandomQuestions(count: number): Promise<Question[]> {
    return this.questions ?? createQuestions(count);
  }

  async pickRandomChoices(count: number): Promise<Choice[]> {
    return createChoices(count);
  }
}
