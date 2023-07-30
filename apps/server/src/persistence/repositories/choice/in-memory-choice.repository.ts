import { Choice } from 'src/entities';
import { defined } from 'src/utils/defined';
import { hasProperty } from 'src/utils/has-property';
import { toObject } from 'src/utils/to-object';

import { InMemoryRepository } from '../../in-memory-repository';

import { ChoiceRepository } from './choice.repository';

export class InMemoryChoiceRepository extends InMemoryRepository<Choice> implements ChoiceRepository {
  async findPlayersCards(gameId: string): Promise<Record<string, Choice[]>> {
    const choices = this.filter(hasProperty('gameId', gameId)).filter(
      (choice) => choice.playerId !== undefined,
    );

    const playersIds = Array.from(new Set(choices.map((choice) => defined(choice.playerId))));

    return toObject(
      playersIds,
      (playerId) => playerId,
      (playerId) => choices.filter(hasProperty('playerId', playerId)),
    );
  }

  async findPlayerCards(playerId: string): Promise<Choice[]> {
    return this.filter(hasProperty('playerId', playerId));
  }

  async findAvailable(gameId: string, limit: number): Promise<Choice[]> {
    return this.filter(hasProperty('gameId', gameId))
      .filter((choice) => choice.playerId === undefined)
      .slice(0, limit);
  }

  async insertMany(choices: Choice[]): Promise<void> {
    this.set(...choices);
  }

  async updateMany(choices: Choice[]): Promise<void> {
    this.set(...choices);
  }
}
