import { Connection, createConnection } from 'typeorm';
import path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import knexFactory from 'knex';
import connectSessionKnex from 'connect-session-knex';
import expressSession from 'express-session';

import { bootstrapServer, Dependencies } from './infrastructure';
import { entities } from './infrastructure/database/entities';
import { GameEventsHandler } from './application/handlers/GameEventsHandler';
import { PlayerEventsHandler } from './application/handlers/PlayerEventsHandler';
import { DtoMapperService } from './application/services/DtoMapperService';
import { GameService } from './application/services/GameService';
import { RandomService } from './application/services/RandomService';
import { InMemoryGameRepository } from './infrastructure/database/repositories/game/InMemoryGameRepository';
import { SQLGameRepository } from './infrastructure/database/repositories/game/SQLGameRepository';
import { InMemoryPlayerRepository } from './infrastructure/database/repositories/player/InMemoryPlayerRepository';
import { SQLPlayerRepository } from './infrastructure/database/repositories/player/SQLPlayerRepository';
import { FilesystemExternalData } from './infrastructure/FilesystemExternalData';
import { PubSub } from './infrastructure/PubSub';
import { WebsocketServer, WebsocketRTCManager } from './infrastructure/web/websocket';
import { EnvConfigService } from './infrastructure/EnvConfigService';

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
