import { Token } from 'typedi';

import { Turn } from '../entities/Turn';

export const TurnRepositoryToken = new Token<TurnRepository>('TurnRepository');

export interface TurnRepository {
  save(turn: Turn): Promise<void>;
}
