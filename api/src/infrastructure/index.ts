import { createConnection, LoggerOptions } from 'typeorm';
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

const createTypeormConnection = (
  file?: string,
  logging?: LoggerOptions,
  overrides?: Partial<SqliteConnectionOptions>,
) => {
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
  connectionOptions: Partial<SqliteConnectionOptions>;
}>;

export const instanciateDependencies = async (config: Config = {}): Promise<Dependencies> => {
  const { configService = new EnvConfigService() } = config;

  const dataDir = configService.get('DATA_DIR');
  const dbFile = configService.get('DB_FILE');
  const dbLogs = configService.get('DB_LOGS');

  const logger = () => new ConsoleLoggerService(configService);

  const publisher = new PubSub(logger());
  const randomService = new RandomService();
  const externalData = dataDir ? new FilesystemExternalData(dataDir, randomService) : new StubExternalData();

  const cache = new InMemoryCache();
  const connection = await createTypeormConnection(dbFile, dbLogs === 'true', config.connectionOptions);

  const playerRepository = connection ? new SQLPlayerRepository(connection) : new InMemoryPlayerRepository(cache);
  const gameRepository = connection ? new SQLGameRepository(connection) : new InMemoryGameRepository(cache);

  const gameService = new GameService(playerRepository, gameRepository, publisher);

  const websocketServer = new WebsocketServer();
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
    websocketServer,
    playerRepository,
    gameRepository,
    gameService,
    randomService,
    externalData,
    rtcManager,
    mapper,
  };
};
