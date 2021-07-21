import { CommandHandler } from '../../ddd/CommandHandler';
import { PlayerIsAlreadyInGameError } from '../../domain/errors/PlayerIsAlreadyInGameError';
import { GameRepository } from '../../domain/interfaces/GameRepository';
import { Game } from '../../domain/models/Game';
import { RTCManager } from '../interfaces/RTCManager';
import { SessionStore } from '../interfaces/SessionStore';
import { GameService } from '../services/GameService';

export class JoinGameCommand {
  constructor(public readonly gameCode: string) {}
}

export class JoinGameHandler implements CommandHandler<JoinGameCommand, Game | undefined, SessionStore> {
  constructor(
    private readonly gameService: GameService,
    private readonly gameRepository: GameRepository,
    private readonly rtcManager: RTCManager,
  ) {}

  async execute({ gameCode }: JoinGameCommand, session: SessionStore) {
    const player = session.player!;

    if (await this.gameRepository.findGameForPlayer(player.id)) {
      throw new PlayerIsAlreadyInGameError(player);
    }

    const game = await this.gameRepository.findGameByCode(gameCode);

    if (!game) {
      return;
    }

    game.addPlayer(player);
    this.rtcManager.join(game, player);

    await this.gameService.saveAndPublish(game);

    return game;
  }
}
