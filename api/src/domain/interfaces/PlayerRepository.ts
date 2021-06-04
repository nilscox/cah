import { Token } from 'typedi';

import { Choice } from '../entities/Choice';
import { Player } from '../entities/Player';

export const PlayerRepositoryToken = new Token('PlayerRepository');

export interface PlayerRepository {
  addCards(player: Player, cards: Choice[]): Promise<void>;
  removeCards(player: Player, cards: Choice[]): Promise<void>;
}
