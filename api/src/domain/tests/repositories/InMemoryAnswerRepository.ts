import _ from 'lodash';

import { Answer } from '../../entities/Answer';
import { AnswerRepository } from '../../interfaces/AnswerRepository';

export class InMemoryAnswerRepository implements AnswerRepository {
  private answers: Answer[] = [];

  set(answers: Answer[]) {
    this.answers = answers;
  }

  async findOne(id: number): Promise<Answer | undefined> {
    return this.answers[id];
  }

  async save(answer: Answer): Promise<void> {
    if (answer.id && this.answers[answer.id]) {
      this.answers[answer.id] = answer;
    } else {
      this.answers.push({ ...answer, id: this.answers.length });
    }
  }

  async saveAll(answers: Answer[]): Promise<void> {
    _.forEach(answers, this.save.bind(this));
  }
}
