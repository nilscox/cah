import path from 'path';

import connectSessionKnex from 'connect-session-knex';
import expressSession from 'express-session';
import knexFactory from 'knex';
import { Connection, createConnection } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { GameEventsHandler } from '../application/handlers/GameEventsHandler';
import { PlayerEventsHandler } from '../application/handlers/PlayerEventsHandler';
import { DtoMapperService } from '../application/services/DtoMapperService';
import { GameService } from '../application/services/GameService';
import { RandomService } from '../application/services/RandomService';

import { entities } from './database/entities';
import { InMemoryGameRepository } from './database/repositories/game/InMemoryGameRepository';
import { SQLGameRepository } from './database/repositories/game/SQLGameRepository';
import { InMemoryPlayerRepository } from './database/repositories/player/InMemoryPlayerRepository';
import { SQLPlayerRepository } from './database/repositories/player/SQLPlayerRepository';
import { EnvConfigService } from './EnvConfigService';
import { FilesystemExternalData } from './FilesystemExternalData';
import { PubSub } from './PubSub';
import { bootstrapServer, Dependencies } from './web';
import { WebsocketRTCManager, WebsocketServer } from './web/websocket';

type Config = {
  dataDir?: string;
  connection?: Connection;
  knex?: ReturnType<typeof knexFactory>;
};

export const main = async (config: Config = {}) => {
  const {
    dataDir = path.resolve(__dirname, '..', 'data'),
    connection = await createConnection({
      type: 'sqlite',
      database: './db.sqlite',
      entities,
      synchronize: true,
      namingStrategy: new SnakeNamingStrategy(),
    }),
    knex = knexFactory({
      useNullAsDefault: true,
      client: 'sqlite3',
      connection: {
        filename: './db.sqlite',
      },
    }),
  } = config;

  const KnexSessionStore = connectSessionKnex(expressSession);

  const knexSessionStore = new KnexSessionStore({
    tablename: 'sessions',
    createtable: true,
    // @ts-expect-error hmm...
    knex: knex,
  });

  const configService = new EnvConfigService();

  const playerRepository = connection ? new SQLPlayerRepository(connection) : new InMemoryPlayerRepository();
  const gameRepository = connection ? new SQLGameRepository(connection) : new InMemoryGameRepository();

  const publisher = new PubSub();
  const gameService = new GameService(playerRepository, gameRepository, publisher);
  const randomService = new RandomService();
  const externalData = new FilesystemExternalData(dataDir, randomService);

  const wss = new WebsocketServer();
  const rtcManager = new WebsocketRTCManager(playerRepository, gameRepository, wss, publisher);

  const gameEventsHandler = new GameEventsHandler(rtcManager);
  const playerEventsHandler = new PlayerEventsHandler(rtcManager);

  const mapper = new DtoMapperService(rtcManager);

  publisher.subscribe(gameEventsHandler);
  publisher.subscribe(playerEventsHandler);

  const deps: Dependencies = {
    configService,
    playerRepository,
    gameRepository,
    gameService,
    randomService,
    externalData,
    wss,
    rtcManager,
    sessionStore: knexSessionStore,
    mapper,
  };

  return bootstrapServer(deps);
};
