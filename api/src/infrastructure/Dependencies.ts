import { ConfigService } from '../application/interfaces/ConfigService';
import { GameRepository } from '../application/interfaces/GameRepository';
import { Logger } from '../application/interfaces/Logger';
import { Notifier } from '../application/interfaces/Notifier';
import { PlayerRepository } from '../application/interfaces/PlayerRepository';
import { RTCManager } from '../application/interfaces/RTCManager';
import { DtoMapperService } from '../application/services/DtoMapperService';
import { GameService } from '../application/services/GameService';
import { RandomService } from '../application/services/RandomService';

import { ExternalData } from './ExternalData';
import { WebsocketServer } from './web/websocket';

export interface Dependencies {
  logger: () => Logger;
  configService: ConfigService;
  notifier: Notifier;
  websocketServer: WebsocketServer;
  playerRepository: PlayerRepository;
  gameRepository: GameRepository;
  gameService: GameService;
  randomService: RandomService;
  externalData: ExternalData;
  rtcManager: RTCManager;
  mapper: DtoMapperService;
}
