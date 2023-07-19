import { Player } from 'src/entities';

export interface PlayerRepository {
  findById(id: string): Promise<Player>;
  findByNick(nick: string): Promise<Player | undefined>;
  findAllByGameId(gameId: string): Promise<Player[]>;
  insert(player: Player): Promise<void>;
  update(player: Player): Promise<void>;
}
