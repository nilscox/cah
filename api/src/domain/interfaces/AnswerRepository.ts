import { Token } from 'typedi';

import { Answer } from '../entities/Answer';
import { Choice } from '../entities/Choice';
import { Player } from '../entities/Player';

export const AnswerRepositoryToken = new Token('AnswerRepository');

export interface AnswerRepository {
  findOne(id: number): Promise<Answer | undefined>;
  createAnswer(player: Player, choices: Choice[]): Promise<Answer>;
}
