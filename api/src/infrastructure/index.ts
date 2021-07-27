import path from 'path';

import connectSessionKnex from 'connect-session-knex';
import expressSession from 'express-session';
import knexFactory, { Knex } from 'knex';
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
import { Dependencies } from './web';
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
  dataDir: string;
  connection: Connection;
  wss: WebsocketServer;
}>;

export const main = async (config: Config = {}): Promise<Dependencies> => {
  const {
    dataDir = path.resolve(__dirname, '..', 'data'),
    connection = await createTypeormConnection(),
    wss = new WebsocketServer(),
  } = config;

  const configService = new EnvConfigService();

  const playerRepository = connection ? new SQLPlayerRepository(connection) : new InMemoryPlayerRepository();
  const gameRepository = connection ? new SQLGameRepository(connection) : new InMemoryGameRepository();

  const publisher = new PubSub();
  const gameService = new GameService(playerRepository, gameRepository, publisher);
  const randomService = new RandomService();
  const externalData = new FilesystemExternalData(dataDir, randomService);

  const rtcManager = new WebsocketRTCManager(playerRepository, gameRepository, wss, publisher);

  const gameEventsHandler = new GameEventsHandler(rtcManager);
  const playerEventsHandler = new PlayerEventsHandler(rtcManager);

  const mapper = new DtoMapperService(rtcManager);

  publisher.subscribe(gameEventsHandler);
  publisher.subscribe(playerEventsHandler);

  return {
    configService,
    playerRepository,
    gameRepository,
    gameService,
    randomService,
    externalData,
    rtcManager,
    mapper,
  };
};
