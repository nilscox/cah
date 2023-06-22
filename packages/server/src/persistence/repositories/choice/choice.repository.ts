import { Choice } from 'src/entities';

import { BaseRepository } from '../../base-repository';

export interface ChoiceRepository extends BaseRepository<Choice> {
  findPlayersCards(gameId: string): Promise<Record<string, Choice[]>>;
  findPlayerCards(playerId: string): Promise<Choice[]>;
  findAvailable(gameId: string, count: number): Promise<Choice[]>;
}
