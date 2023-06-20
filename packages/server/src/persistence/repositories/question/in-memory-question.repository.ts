import { Question } from 'src/entities';

import { InMemoryRepository } from '../../in-memory-repository';

import { QuestionRepository } from './question.repository';

export class InMemoryQuestionRepository extends InMemoryRepository<Question> implements QuestionRepository {}
