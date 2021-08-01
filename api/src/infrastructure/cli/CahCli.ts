import { Connection } from 'typeorm';

import { DtoMapperService } from '../../application/services/DtoMapperService';
import { GameService } from '../../application/services/GameService';
import { DomainError } from '../../domain/errors/DomainError';
import { Game } from '../../domain/models/Game';
import { Player } from '../../domain/models/Player';
import { SQLGameRepository } from '../database/repositories/game/SQLGameRepository';
import { SQLPlayerRepository } from '../database/repositories/player/SQLPlayerRepository';
import { Dependencies } from '../Dependencies';
import { EnvConfigService } from '../EnvConfigService';
import { FilesystemExternalData } from '../FilesystemExternalData';
import { StubEventPublisher } from '../stubs/StubEventPublisher';
import { StubExternalData } from '../stubs/StubExternalData';
import { StubLogger } from '../stubs/StubLogger';
import { StubNotifier } from '../stubs/StubNotifier';
import { StubRandomService } from '../stubs/StubRandomService';
import { StubRTCManager } from '../stubs/StubRTCManager';

import { Command } from './Command';
import { Answer } from './commands/Answer';
import { CreateGame } from './commands/CreateGame';
import { CreatePlayer } from './commands/CreatePlayer';
import { Info } from './commands/Info';
import { JoinGame } from './commands/JoinGame';
import { NextTurn } from './commands/NextTurn';
import { Reset } from './commands/Reset';
import { SelectWinner } from './commands/SelectWinner';
import { StartGame } from './commands/StartGame';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const commands: Record<string, { new (...args: any[]): Command }> = {
  reset: Reset,
  info: Info,
  'create-player': CreatePlayer,
  'create-game': CreateGame,
  join: JoinGame,
  start: StartGame,
  answer: Answer,
  select: SelectWinner,
  next: NextTurn,
};

type Args = Partial<{
  as: string;
  player: string;
  quiet: boolean;
  [key: string]: unknown;
}>;

export class CahCli {
  deps: Dependencies;

  constructor(readonly connection: Connection) {
    const configService = new EnvConfigService();
    const logger = () => new StubLogger();

    const dataDir = configService.get('DATA_DIR');

    const playerRepository = new SQLPlayerRepository(this.connection);
    const gameRepository = new SQLGameRepository(this.connection);

    const publisher = new StubEventPublisher();
    const notifier = new StubNotifier();
    const gameService = new GameService(playerRepository, gameRepository, publisher);
    const randomService = new StubRandomService();
    const externalData = dataDir ? new FilesystemExternalData(dataDir, randomService) : new StubExternalData();

    const rtcManager = new StubRTCManager();

    const mapper = new DtoMapperService(rtcManager);

    this.deps = {
      logger,
      configService,
      notifier,
      playerRepository,
      gameRepository,
      gameService,
      randomService,
      externalData,
      rtcManager,
      mapper,
    };
  }

  async run(command: string, args: Args) {
    const Command = commands[command];

    if (!Command) {
      console.error(`Command "${command}" does not exist`);
      return 2;
    }

    const as = args.player ?? args.as;
    let player: Player | undefined, game: Game | undefined;

    const { playerRepository, gameRepository } = this.deps;

    if (as) {
      player = await playerRepository.findPlayerByNick(as);

      if (!player) {
        console.error(`Player with nick "${as}" does not exist`);
        return 2;
      }

      game = await gameRepository.findGameForPlayer(player.id);
    }

    try {
      const cmd = new Command(this.connection, this.deps);

      cmd.quiet = args.quiet ?? false;

      cmd.player = player;
      cmd.game = game;

      await cmd.run(args);
    } catch (error) {
      if (error instanceof DomainError) {
        console.error(error.message);
      } else {
        console.error(error);
      }

      return 3;
    } finally {
      await this.connection.close();
    }

    return 0;
  }
}
