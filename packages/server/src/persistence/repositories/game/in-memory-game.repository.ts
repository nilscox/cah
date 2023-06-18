import { Game } from '@cah/shared';

import { InMemoryRepository } from '../../in-memory-repository';

import { GameRepository } from './game.repository';

export class InMemoryGameRepository extends InMemoryRepository<Game> implements GameRepository {}
