import { Answer } from 'src/entities';

import { InMemoryRepository } from '../../in-memory-repository';

import { AnswerRepository } from './answer.repository';

export class InMemoryAnswerRepository extends InMemoryRepository<Answer> implements AnswerRepository {}
