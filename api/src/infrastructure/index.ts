import { Connection, createConnection } from 'typeorm';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
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

export const createTypeormConnection = (config: ConfigService, overrides?: Partial<SqliteConnectionOptions>) => {
  const file = config.get('DB_FILE');
  const logging = config.get('DB_LOGS') === 'true';

  if (!file) {
    return;
  }

  return createConnection({
    type: 'sqlite',
    database: file,
    entities,
    logging,
    namingStrategy: new SnakeNamingStrategy(),
    ...overrides,
  });
};

type Config = Partial<{
  configService: ConfigService;
  websocketServer: WebsocketServer;
  connection: Connection;
}>;

export const instanciateDependencies = async (config: Config = {}): Promise<Dependencies> => {
  const { configService = new EnvConfigService(), websocketServer = new WebsocketServer() } = config;
  const { connection = await createTypeormConnection(configService) } = config;

  const logger = () => new ConsoleLoggerService(configService);

  const publisher = new PubSub(logger());
  const randomService = new RandomService();

  const dataDir = configService.get('DATA_DIR');
  const externalData = dataDir ? new FilesystemExternalData(dataDir, randomService) : new StubExternalData();

  const cache = new InMemoryCache();

  const playerRepository = connection ? new SQLPlayerRepository(connection) : new InMemoryPlayerRepository(cache);
  const gameRepository = connection ? new SQLGameRepository(connection) : new InMemoryGameRepository(cache);

  const gameService = new GameService(playerRepository, gameRepository, publisher);

  const rtcManager = new WebsocketRTCManager(playerRepository, gameRepository, websocketServer, publisher);

  const gameEventsHandler = new GameEventsHandler(logger(), rtcManager, rtcManager);
  const playerEventsHandler = new PlayerEventsHandler(logger(), rtcManager);

  const mapper = new DtoMapperService(gameRepository, rtcManager);

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
