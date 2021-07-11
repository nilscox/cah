import { Player } from '../models/Player';

export interface PlayerRepository {
  findPlayerById(id: string): Promise<Player | undefined>;
  save(player: Player): Promise<void>;
}
