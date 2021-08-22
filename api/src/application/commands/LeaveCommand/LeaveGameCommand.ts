import { CommandHandler } from '../../../ddd/CommandHandler';
import { PlayerRepository } from '../../interfaces/PlayerRepository';
import { RTCManager } from '../../interfaces/RTCManager';
import { SessionStore } from '../../interfaces/SessionStore';
import { GameService } from '../../services/GameService';

export class LeaveGameCommand {}

export class LeaveGameHandler implements CommandHandler<LeaveGameCommand, void, SessionStore> {
  constructor(
    private readonly gameService: GameService,
    private readonly playerRepository: PlayerRepository,
    private readonly rtcManager: RTCManager,
  ) {}

  async execute(_: LeaveGameCommand, session: SessionStore) {
    const player = session.player!;
    const game = await this.gameService.getGameForPlayer(player.id);

    game.removePlayer(player);
    this.rtcManager.leave(game, player);

    await this.playerRepository.save(player);
    await this.gameService.saveAndPublish(game);
  }
}
