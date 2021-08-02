import connectSessionKnex from 'connect-session-knex';
import expressSession from 'express-session';
import knexFactory, { Knex } from 'knex';
import { Connection, createConnection } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { GameEventsHandler } from '../application/handlers/GameEventsHandler/GameEventsHandler';
import { PlayerEventsHandler } from '../application/handlers/PlayerEventsHandler/PlayerEventsHandler';
import { ConfigService } from '../application/interfaces/ConfigService';
import { DtoMapperService } from '../application/services/DtoMapperService';
import { GameService } from '../application/services/GameService';
import { RandomService } from '../application/services/RandomService';

import { ConsoleLoggerService } from './ConsoleLoggerService';
import { entities } from './database/entities';
import { InMemoryCache } from './database/InMemoryCache';
import { InMemoryGameRepository } from './database/repositories/game/InMemoryGameRepository';
import { SQLGameRepository } from './database/repositories/game/SQLGameRepository';
import { InMemoryPlayerRepository } from './database/repositories/player/InMemoryPlayerRepository';
import { SQLPlayerRepository } from './database/repositories/player/SQLPlayerRepository';
import { Dependencies } from './Dependencies';
import { EnvConfigService } from './EnvConfigService';
import { FilesystemExternalData } from './FilesystemExternalData';
import { PubSub } from './PubSub';
import { StubExternalData } from './stubs/StubExternalData';
import { WebsocketRTCManager, WebsocketServer } from './web/websocket';

export const createTypeormConnection = () => {
  return createConnection({
    type: 'sqlite',
    database: './db.sqlite',
    entities,
    synchronize: true,
    namingStrategy: new SnakeNamingStrategy(),
  });
};

export const createKnexConnection = () => {
  return knexFactory({
    useNullAsDefault: true,
    client: 'sqlite3',
    connection: {
      filename: './db.sqlite',
    },
  });
};

export const createKnexSessionStore = (knex: Knex) => {
  const KnexSessionStore = connectSessionKnex(expressSession);

  return new KnexSessionStore({
    tablename: 'sessions',
    createtable: true,
    // @ts-expect-error knex version issue
    knex,
  });
};

type Config = Partial<{
  connection: Connection;
  wss: WebsocketServer;
  configService: ConfigService;
}>;

export const instanciateDependencies = async (config: Config = {}): Promise<Dependencies> => {
  const { connection, wss = new WebsocketServer(), configService = new EnvConfigService() } = config;

  const dataDir = configService.get('DATA_DIR');

  const logger = () => new ConsoleLoggerService(configService);

  const cache = new InMemoryCache();
  const playerRepository = connection ? new SQLPlayerRepository(connection) : new InMemoryPlayerRepository(cache);
  const gameRepository = connection ? new SQLGameRepository(connection) : new InMemoryGameRepository(cache);

  const publisher = new PubSub(logger());
  const gameService = new GameService(playerRepository, gameRepository, publisher);
  const randomService = new RandomService();
  const externalData = dataDir ? new FilesystemExternalData(dataDir, randomService) : new StubExternalData();

  const rtcManager = new WebsocketRTCManager(playerRepository, gameRepository, wss, publisher);

  const gameEventsHandler = new GameEventsHandler(logger(), rtcManager, rtcManager);
  const playerEventsHandler = new PlayerEventsHandler(logger(), rtcManager);

  const mapper = new DtoMapperService(rtcManager);

  publisher.subscribe(gameEventsHandler);
  publisher.subscribe(playerEventsHandler);

  return {
    logger,
    configService,
    notifier: rtcManager,
    playerRepository,
    gameRepository,
    gameService,
    randomService,
    externalData,
    rtcManager,
    mapper,
  };
};
