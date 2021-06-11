// eslint-disable-next-line simple-import-sort/imports
import 'reflect-metadata';
//
import { Container } from 'typedi';
import { createConnection, getCustomRepository } from 'typeorm';
//
import { app } from './application/web';
import { ChoiceRepositoryToken } from './domain/interfaces/ChoiceRepository';
import { ExternalDataToken } from './domain/interfaces/ExternalData';
import { GameRepositoryToken } from './domain/interfaces/GameRepository';
import { PlayerRepositoryToken } from './domain/interfaces/PlayerRepository';
import { QuestionRepositoryToken } from './domain/interfaces/QuestionRepository';
import { TurnRepositoryToken } from './domain/interfaces/TurnRepository';
import { SQLChoiceRepository } from './infrastructure/database/repositories/SQLChoiceRepository';
import { SQLGameRepository } from './infrastructure/database/repositories/SQLGameRepository';
import { SQLPlayerRepository } from './infrastructure/database/repositories/SQLPlayerRepository';
import { SQLQuestionRepository } from './infrastructure/database/repositories/SQLQuestionRepository';
import { SQLTurnRepository } from './infrastructure/database/repositories/SQLTurnRepository';
import { FilesystemExternalData } from './infrastructure/FilesystemExternalData';

const {
  DATABASE = ':memory:',
  ENTITIES = 'src/infrastructure/database/entities/*.ts',
  DATA_DIR = './data',
} = process.env;

const main = async () => {
  await createConnection({
    type: 'sqlite',
    database: DATABASE,
    entities: [ENTITIES],
    synchronize: true,
    logging: ['error'],
  });

  Container.set(GameRepositoryToken, new SQLGameRepository());
  Container.set(ChoiceRepositoryToken, getCustomRepository(SQLChoiceRepository));
  Container.set(QuestionRepositoryToken, getCustomRepository(SQLQuestionRepository));
  Container.set(PlayerRepositoryToken, getCustomRepository(SQLPlayerRepository));
  Container.set(TurnRepositoryToken, getCustomRepository(SQLTurnRepository));

  Container.set('DATA_DIR', DATA_DIR);
  Container.set(ExternalDataToken, new FilesystemExternalData());

  app.listen(4242, '0.0.0.0', () => {
    console.log('server listening on 0.0.0.0:4242');
  });
};

main().catch(console.error);
