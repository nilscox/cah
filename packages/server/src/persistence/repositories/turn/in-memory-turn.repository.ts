import * as shared from '@cah/shared';

import { Turn } from 'src/entities';

import { EntityNotFoundError } from '../../entity-not-found-error';
import { InMemoryRepository } from '../../in-memory-repository';

import { TurnRepository } from './turn.repository';

export class InMemoryTurnRepository extends InMemoryRepository<Turn> implements TurnRepository {
  async query(turnId: string): Promise<shared.Turn> {
    const turn = this.get(turnId);

    if (!turn) {
      throw new EntityNotFoundError('Turn', { id: turnId });
    }

    return {
      id: turn.id,
    };
  }

  async insert(turn: Turn): Promise<void> {
    return this.set(turn);
  }
}
