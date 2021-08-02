import { CommandHandler } from '../../../ddd/CommandHandler';
import { PlayerIsAlreadyInGameError } from '../../../domain/errors/PlayerIsAlreadyInGameError';
import { Game } from '../../../domain/models/Game';
import { ConfigService } from '../../interfaces/ConfigService';
import { GameRepository } from '../../interfaces/GameRepository';
import { RTCManager } from '../../interfaces/RTCManager';
import { SessionStore } from '../../interfaces/SessionStore';
import { DtoMapperService } from '../../services/DtoMapperService';
import { GameService } from '../../services/GameService';

export class CreateGameCommand {}

export type CreateGameResult = {
  id: string;
};

export class CreateGameHandler implements CommandHandler<CreateGameCommand, CreateGameResult, SessionStore> {
  constructor(
    private readonly configService: ConfigService,
    private readonly gameService: GameService,
    private readonly gameRepository: GameRepository,
    private readonly rtcManager: RTCManager,
    private readonly mapper: DtoMapperService,
  ) {}

  async execute(_: CreateGameCommand, session: SessionStore) {
    const player = session.player!;

    if (await this.gameRepository.findGameForPlayer(player.id)) {
      throw new PlayerIsAlreadyInGameError(player);
    }

    const code = this.configService.get('GAME_CODE');
    const game = new Game(undefined, code);

    game.addPlayer(player);
    this.rtcManager.join(game, player);

    await this.gameService.saveAndPublish(game);

    return this.mapper.gameToDto(game);
  }
}
