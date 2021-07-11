import { Connection, ConnectionOptions, createConnection, getRepository } from 'typeorm';

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const pg: ConnectionOptions = {
      type: 'postgres',
      host: 'localhost',
      database: 'db',
      username: 'root',
      password: 'root',
    };

    const sqlite: ConnectionOptions = {
      type: 'sqlite',
      database: ':memory:',
    };

    connection = await createConnection({
      ...sqlite,
      entities: ['src/infrastructure/database/entities/*.ts'],
      dropSchema: true,
      synchronize: true,
      // logging: ['query', 'error'],
      // maxQueryExecutionTime: 150,
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
