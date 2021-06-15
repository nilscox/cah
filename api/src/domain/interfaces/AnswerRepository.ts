import { Token } from 'typedi';

import { Answer } from '../entities/Answer';
import { Game } from '../entities/Game';

export const AnswerRepositoryToken = new Token<AnswerRepository>('AnswerRepository');

export interface AnswerRepository {
  findAll(): Promise<Answer[]>;
  findOne(id: number): Promise<Answer | undefined>;
  save(answer: Answer): Promise<void>;
  saveAll(answer: Answer[]): Promise<void>;
  setGame(answer: Answer, game: Game): Promise<void>;
  findForGame(game: Game): Promise<Answer[]>;
}
