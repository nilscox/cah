import { Token } from 'typedi';

import { Answer } from '../entities/Answer';

export const AnswerRepositoryToken = new Token<AnswerRepository>('AnswerRepository');

export interface AnswerRepository {
  findOne(id: number): Promise<Answer | undefined>;
  save(answer: Answer): Promise<void>;
  saveAll(answer: Answer[]): Promise<void>;
}
