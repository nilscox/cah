import { Choice } from '../../domain/models/Choice';
import { Question } from '../../domain/models/Question';
import { ExternalData } from '../ExternalData';

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

  private randomChoices?: Choice[];

  setRandomChoices(choices: Choice[]) {
    this.randomChoices = choices;
  }

  async pickRandomChoices(count: number): Promise<Choice[]> {
    if (this.randomChoices) {
      return this.randomChoices;
    }

    return Array(count ?? 0)
      .fill(null)
      .map((_, n) => new Choice(`Choice ${n + 1}`, false));
  }
}
