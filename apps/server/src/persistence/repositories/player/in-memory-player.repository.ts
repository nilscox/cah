import * as shared from '@cah/shared';
import { hasProperty } from '@cah/utils';

import { type Player } from 'src/entities';

import { EntityNotFoundError } from '../../entity-not-found-error.ts';
import { InMemoryRepository } from '../../in-memory-repository.ts';

import { type PlayerRepository } from './player.repository.ts';

export class InMemoryPlayerRepository extends InMemoryRepository<Player> implements PlayerRepository {
  async query(playerId: string): Promise<shared.CurrentPlayer> {
    const player = this.get(playerId);

    if (!player) {
      throw new EntityNotFoundError('Player', { id: playerId });
    }

    return {
      id: player.id,
      nick: player.nick,
    };
  }

  async findById(playerId: string): Promise<Player> {
    const player = this.get(playerId);

    if (!player) {
      throw new EntityNotFoundError('Player', { id: playerId });
    }

    return player;
  }

  async findByNick(nick: string): Promise<Player | undefined> {
    return this.find(hasProperty('nick', nick));
  }

  async findAllByGameId(gameId: string): Promise<Player[]> {
    return this.filter(hasProperty('gameId', gameId));
  }

  async insert(player: Player): Promise<void> {
    return this.set(player);
  }

  async update(player: Player): Promise<void> {
    return this.set(player);
  }
}
