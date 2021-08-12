import { CommandHandler } from '../../../ddd/CommandHandler';
import { GameNotFoundError } from '../../../domain/errors/GameNotFoundError';
import { PlayerIsAlreadyInGameError } from '../../../domain/errors/PlayerIsAlreadyInGameError';
import { GameDto } from '../../../shared/dtos';
import { GameRepository } from '../../interfaces/GameRepository';
import { RTCManager } from '../../interfaces/RTCManager';
import { SessionStore } from '../../interfaces/SessionStore';
import { DtoMapperService } from '../../services/DtoMapperService';
import { GameService } from '../../services/GameService';

export class JoinGameCommand {
  constructor(public readonly gameCode: string) {}
}

export class JoinGameHandler implements CommandHandler<JoinGameCommand, GameDto, SessionStore> {
  constructor(
    private readonly gameService: GameService,
    private readonly gameRepository: GameRepository,
    private readonly rtcManager: RTCManager,
    private readonly mapper: DtoMapperService,
  ) {}

  async execute({ gameCode }: JoinGameCommand, session: SessionStore) {
    const player = session.player!;

    if (await this.gameRepository.findGameForPlayer(player.id)) {
      throw new PlayerIsAlreadyInGameError(player);
    }

    const game = await this.gameRepository.findGameByCode(gameCode);

    if (!game) {
      throw new GameNotFoundError({ code: gameCode });
    }

    game.addPlayer(player);
    this.rtcManager.join(game, player);

    await this.gameService.saveAndPublish(game);

    return this.mapper.gameToDto(game);
  }
}
