import { Token } from 'typedi';

import { Choice } from '../entities/Choice';
import { Player } from '../entities/Player';

export const PlayerRepositoryToken = new Token<PlayerRepository>('PlayerRepository');

export interface PlayerRepository {
  findOne(id: number): Promise<Player | undefined>;
  findByNick(nick: string): Promise<Player | undefined>;
  save(player: Player): Promise<void>;
  addCards(player: Player, cards: Choice[]): Promise<void>;
  removeCards(player: Player, cards: Choice[]): Promise<void>;
}
