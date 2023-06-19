import { Game } from '@cah/shared';

import { BaseRepository } from '../../base-repository';

export interface GameRepository extends BaseRepository<Game> {
  findByCode(code: string): Promise<Game>;
}
