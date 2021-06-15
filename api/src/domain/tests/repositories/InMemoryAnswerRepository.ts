import { Answer } from '../../entities/Answer';
import { AnswerRepository } from '../../interfaces/AnswerRepository';

export class InMemoryAnswerRepository implements AnswerRepository {
  private answers: Answer[] = [];

  setAnswers(answers: Answer[]) {
    this.answers = answers;
  }

  async findAll(): Promise<Answer[]> {
    return this.answers;
  }

  async findOne(id: number): Promise<Answer | undefined> {
    return this.answers.find((answer) => answer.id === id);
  }

  async save(answer: Answer): Promise<void> {
    if (this.answers[answer.id]) {
      this.answers[answer.id] = answer;
    } else {
      answer.id = this.answers.length;
      this.answers.push(answer);
    }
  }

  async saveAll(answers: Answer[]): Promise<void> {
    for (const answer of answers) {
      this.save(answer);
    }
  }
}
