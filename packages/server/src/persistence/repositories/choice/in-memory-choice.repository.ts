import { Choice } from 'src/entities';

import { InMemoryRepository } from '../../in-memory-repository';

import { ChoiceRepository } from './choice.repository';

export class InMemoryChoiceRepository extends InMemoryRepository<Choice> implements ChoiceRepository {}
