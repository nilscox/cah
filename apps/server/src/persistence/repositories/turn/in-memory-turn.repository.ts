import * as shared from '@cah/shared';

import { type Turn } from 'src/entities';

import { InMemoryRepository } from '../../in-memory-repository.ts';

import { type TurnRepository } from './turn.repository.ts';

export class InMemoryTurnRepository extends InMemoryRepository<Turn> implements TurnRepository {
  query(): Promise<shared.Turn> {
    throw new Error('Method not implemented.');
  }

  queryForGame(): Promise<shared.Turn[]> {
    throw new Error('Method not implemented.');
  }

  async insert(turn: Turn): Promise<void> {
    return this.set(turn);
  }
}
