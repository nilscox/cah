import { Connection, createConnection, getRepository } from 'typeorm';

import { randomString, RequireField } from '../../utils';

import { AnswerEntity } from './entities/AnswerEntity';
import { ChoiceEntity } from './entities/ChoiceEntity';
import { GameEntity } from './entities/GameEntity';
import { PlayerEntity } from './entities/PlayerEntity';
import { QuestionEntity } from './entities/QuestionEntity';
import { TurnEntity } from './entities/TurnEntity';

export const createTestDatabase = () => {
  let connection: Connection;

  before(async () => {
    connection = await createConnection({
      type: 'sqlite',
      // database: ':memory:',
      database: './db.sqlite',
      entities: ['src/infrastructure/database/entities/*.ts'],
      dropSchema: true,
      synchronize: true,
      logging: ['error'],
      // logging: ['query'],
    });
  });

  after(async () => {
    await connection.close();
  });
};

export const createPlayer = (overrides?: Partial<PlayerEntity>) => {
  return getRepository(PlayerEntity).save(Object.assign(new PlayerEntity(), { nick: randomString(), ...overrides }));
};

export const createGame = (overrides?: Partial<GameEntity>) => {
  return getRepository(GameEntity).save(Object.assign(new GameEntity(), { code: randomString(), ...overrides }));
};

export const createQuestion = (overrides: RequireField<Partial<QuestionEntity>, 'game'>) => {
  return getRepository(QuestionEntity).save(Object.assign(new QuestionEntity(), { text: '', ...overrides }));
};

export const createChoice = (overrides?: Partial<ChoiceEntity>) => {
  return getRepository(ChoiceEntity).save(Object.assign(new ChoiceEntity(), { text: '', ...overrides }));
};

export const createAnswer = (overrides?: RequireField<Partial<AnswerEntity>, 'player'>) => {
  return getRepository(AnswerEntity).save(Object.assign(new AnswerEntity(), { text: '', ...overrides }));
};

export const createTurn = (
  overrides: RequireField<Partial<TurnEntity>, 'game' | 'question' | 'questionMaster' | 'winner'>,
) => {
  return getRepository(TurnEntity).save(Object.assign(new TurnEntity(), { text: '', ...overrides }));
};
