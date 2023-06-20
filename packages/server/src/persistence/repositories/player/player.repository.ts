import { Player } from 'src/entities';

import { BaseRepository } from '../../base-repository';

export interface PlayerRepository extends BaseRepository<Player> {
  findAllByGameId(gameId: string): Promise<Player[]>;
  findByNick(nick: string): Promise<Player | undefined>;
}
