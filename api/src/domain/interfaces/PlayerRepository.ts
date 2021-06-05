import { Token } from 'typedi';

import { Choice } from '../entities/Choice';
import { Player } from '../entities/Player';

export const PlayerRepositoryToken = new Token<PlayerRepository>('PlayerRepository');

export interface PlayerRepository {
  findById(id: number): Promise<Player | undefined>;
  findByNick(nick: string): Promise<Player | undefined>;
  createPlayer(nick: string): Promise<Player>;
  addCards(player: Player, cards: Choice[]): Promise<void>;
  removeCards(player: Player, cards: Choice[]): Promise<void>;
}
