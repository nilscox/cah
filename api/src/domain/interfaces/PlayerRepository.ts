import { Choice } from '../entities/Choice';
import { Player } from '../entities/Player';

export interface PlayerRepository {
  addCards(player: Player, cards: Choice[]): Promise<void>;
  removeCards(player: Player, cards: Choice[]): Promise<void>;
}
