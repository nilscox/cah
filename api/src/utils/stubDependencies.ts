import { DtoMapperService } from '../application/services/DtoMapperService';
import { GameService } from '../application/services/GameService';
import { InMemoryGameRepository } from '../infrastructure/database/repositories/game/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../infrastructure/database/repositories/player/InMemoryPlayerRepository';
import { Dependencies } from '../infrastructure/Dependencies';
import { StubConfigService } from '../infrastructure/stubs/StubConfigService';
import { StubEventPublisher } from '../infrastructure/stubs/StubEventPublisher';
import { StubExternalData } from '../infrastructure/stubs/StubExternalData';
import { StubLogger } from '../infrastructure/stubs/StubLogger';
import { StubNotifier } from '../infrastructure/stubs/StubNotifier';
import { StubRandomService } from '../infrastructure/stubs/StubRandomService';
import { StubRTCManager } from '../infrastructure/stubs/StubRTCManager';

import { GameBuilder } from './GameBuilder';

export interface StubDependencies extends Dependencies {
  logger: () => StubLogger;
  configService: StubConfigService;
  randomService: StubRandomService;
  externalData: StubExternalData;
  rtcManager: StubRTCManager;
  mapper: DtoMapperService;
  publisher: StubEventPublisher;
  notifier: StubNotifier;
  playerRepository: InMemoryPlayerRepository;
  gameRepository: InMemoryGameRepository;
  gameService: GameService;
  builder: GameBuilder;
}

export const instanciateStubDependencies = (): StubDependencies => {
  const logger = () => new StubLogger();

  const configService = new StubConfigService();

  const randomService = new StubRandomService();
  const externalData = new StubExternalData();

  const rtcManager = new StubRTCManager();

  const mapper = new DtoMapperService(rtcManager);

  const publisher = new StubEventPublisher();
  const notifier = new StubNotifier();

  const playerRepository = new InMemoryPlayerRepository();
  const gameRepository = new InMemoryGameRepository();

  const gameService = new GameService(playerRepository, gameRepository, publisher);

  const builder = new GameBuilder(gameRepository, playerRepository, externalData);

  return {
    logger,
    configService,
    publisher,
    notifier,
    playerRepository,
    gameRepository,
    gameService,
    randomService,
    externalData,
    rtcManager,
    mapper,
    builder,
  };
};
