import { Player } from 'src/entities';

export interface PlayerRepository {
  findByIdOrFail(playerId: string): Promise<Player>;
  findAllByGameId(gameId: string): Promise<Player[]>;
  findByNick(nick: string): Promise<Player | undefined>;
  insert(player: Player): Promise<void>;
  update(player: Player): Promise<void>;
}
