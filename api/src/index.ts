// eslint-disable-next-line simple-import-sort/imports
import 'reflect-metadata';
//
import { Container } from 'typedi';
import { createConnection } from 'typeorm';
//
import { app } from './application/web';
import { ChoiceRepositoryToken } from './domain/interfaces/ChoiceRepository';
import { GameRepositoryToken } from './domain/interfaces/GameRepository';
import { PlayerRepositoryToken } from './domain/interfaces/PlayerRepository';
import { QuestionRepositoryToken } from './domain/interfaces/QuestionRepository';
import { TurnRepositoryToken } from './domain/interfaces/TurnRepository';
import { SQLChoiceRepository } from './infrastructure/database/repositories/SQLChoiceRepository';
import { SQLGameRepository } from './infrastructure/database/repositories/SQLGameRepository';
import { SQLPlayerRepository } from './infrastructure/database/repositories/SQLPlayerRepository';
import { SQLQuestionRepository } from './infrastructure/database/repositories/SQLQuestionRepository';
import { SQLTurnRepository } from './infrastructure/database/repositories/SQLTurnRepository';

const main = async () => {
  await createConnection({
    type: 'sqlite',
    database: ':memory:',
    // database: './db.sqlite',
    entities: ['src/infrastructure/database/entities/*.ts'],
    synchronize: true,
    logging: ['error'],
  });

  Container.set(ChoiceRepositoryToken, new SQLChoiceRepository());
  Container.set(GameRepositoryToken, new SQLGameRepository());
  Container.set(QuestionRepositoryToken, new SQLQuestionRepository());
  Container.set(PlayerRepositoryToken, new SQLPlayerRepository());
  Container.set(TurnRepositoryToken, new SQLTurnRepository());

  app.listen(4242, '0.0.0.0', () => {
    console.log('server listening on 0.0.0.0:4242');
  });
};

main().catch(console.error);
