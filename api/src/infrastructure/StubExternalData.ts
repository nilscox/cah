import { ExternalData } from '../domain/interfaces/ExternalData';
import { Choice } from '../domain/models/Choice';
import { Question } from '../domain/models/Question';

export class StubExternalData implements ExternalData {
  private randomQuestions?: Question[];

  setRandomQuestions(questions: Question[]) {
    this.randomQuestions = questions;
  }

  async pickRandomQuestions(count: number): Promise<Question[]> {
    if (this.randomQuestions) {
      return this.randomQuestions;
    }

    return Array(count ?? 0)
      .fill(null)
      .map((_, n) => new Question(`Question ${n + 1}`));
  }

  async pickRandomChoices(count: number): Promise<Choice[]> {
    return Array(count ?? 0)
      .fill(null)
      .map((_, n) => new Choice(`Choice ${n + 1}`));
  }
}
