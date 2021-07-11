import { Turn } from '../../entities/Turn';
import { TurnRepository } from '../../interfaces/TurnRepository';

import { InMemoryRepository } from './InMemoryRepository';

export class InMemoryTurnRepository extends InMemoryRepository<Turn> implements TurnRepository {}
