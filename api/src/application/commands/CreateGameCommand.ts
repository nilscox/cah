import { CommandHandler } from '../../ddd/CommandHandler';
import { PlayerIsAlreadyInGameError } from '../../domain/errors/PlayerIsAlreadyInGameError';
import { GameRepository } from '../../domain/interfaces/GameRepository';
import { Game } from '../../domain/models/Game';
import { RTCManager } from '../interfaces/RTCManager';
import { SessionStore } from '../interfaces/SessionStore';
import { DtoMapperService } from '../services/DtoMapperService';
import { GameService } from '../services/GameService';

export class CreateGameCommand {}

export type CreateGameResult = {
  id: string;
};

export class CreateGameHandler implements CommandHandler<CreateGameCommand, CreateGameResult, SessionStore> {
  constructor(
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

    const game = new Game();

    game.addPlayer(player);
    this.rtcManager.join(game, player);

    await this.gameService.saveAndPublish(game);

    return this.mapper.gameToDto(game);
  }
}
