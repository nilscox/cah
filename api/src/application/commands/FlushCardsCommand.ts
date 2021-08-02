import { CommandHandler } from '../../ddd/CommandHandler';
import { PlayerRepository } from '../interfaces/PlayerRepository';
import { SessionStore } from '../interfaces/SessionStore';
import { GameService } from '../services/GameService';

export class FlushCardsCommand {}

export class FlushCardsHandler implements CommandHandler<FlushCardsCommand, void, SessionStore> {
  constructor(private readonly playerRepository: PlayerRepository, private readonly gameService: GameService) {}

  async execute(_: FlushCardsCommand, context: SessionStore): Promise<void> {
    const player = await this.gameService.getPlayer(context.player!.id);

    player.removeCards(player.cards);

    await this.playerRepository.save(player);

    const game = await this.gameService.getGameForPlayer(player.id);

    await this.gameService.dealCards(game);
    await this.gameService.saveAndPublish(game);
  }
}
