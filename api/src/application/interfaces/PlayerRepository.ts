import { Player } from '../../domain/models/Player';

export interface PlayerRepository {
  save(player: Player | Player[]): Promise<void>;
  findAll(): Promise<Player[]>;
  findPlayerById(id: string): Promise<Player | undefined>;
  findPlayerByNick(nick: string): Promise<Player | undefined>;
}
