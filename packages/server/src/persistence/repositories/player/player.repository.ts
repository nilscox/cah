import { Player } from '@cah/shared';

import { BaseRepository } from '../../base-repository';

export interface PlayerRepository extends BaseRepository<Player> {
  findByNick(nick: string): Promise<Player | undefined>;
}
