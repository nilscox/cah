import { CommandHandler } from '../../ddd/CommandHandler';
import { PlayerIsAlreadyInGameError } from '../../domain/errors/PlayerIsAlreadyInGameError';
import { GameRepository } from '../../domain/interfaces/GameRepository';
import { RTCManager } from '../interfaces/RTCManager';
import { SessionStore } from '../interfaces/SessionStore';
import { GameService } from '../services/GameService';

export class JoinGameCommand {
  constructor(public readonly gameId: string) {}
}

export class JoinGameHandler implements CommandHandler<JoinGameCommand, void, SessionStore> {
  constructor(
    private readonly gameService: GameService,
    private readonly gameRepository: GameRepository,
    private readonly rtcManager: RTCManager,
  ) {}

  async execute({ gameId }: JoinGameCommand, session: SessionStore) {
    const player = session.player!;

    if (await this.gameRepository.findGameForPlayer(player.id)) {
      throw new PlayerIsAlreadyInGameError(player);
    }

    const game = await this.gameService.getGame(gameId);

    game.addPlayer(player);
    this.rtcManager.join(game, player);

    await this.gameService.saveAndPublish(game);
  }
}
