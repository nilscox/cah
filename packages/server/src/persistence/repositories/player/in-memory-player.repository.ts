import { Player } from '@cah/shared';

import { InMemoryRepository } from '../../in-memory-repository';

import { PlayerRepository } from './player.repository';

export class InMemoryPlayerRepository extends InMemoryRepository<Player> implements PlayerRepository {}
