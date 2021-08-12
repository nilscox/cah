import { CommandHandler } from '../../../ddd/CommandHandler';
import { CannotFlushCardsError } from '../../../domain/errors/CannotFlushCardsError';
import { InvalidPlayStateError } from '../../../domain/errors/InvalidPlayStateError';
import { PlayState } from '../../../shared/enums';
import { PlayerRepository } from '../../interfaces/PlayerRepository';
import { SessionStore } from '../../interfaces/SessionStore';
import { GameService } from '../../services/GameService';

export class FlushCardsCommand {}

export class FlushCardsHandler implements CommandHandler<FlushCardsCommand, void, SessionStore> {
  constructor(private readonly playerRepository: PlayerRepository, private readonly gameService: GameService) {}

  async execute(_: FlushCardsCommand, context: SessionStore): Promise<void> {
    const player = await this.gameService.getPlayer(context.player!.id);
    let game = await this.gameService.getGameForPlayer(player.id);

    if (game.playState !== PlayState.playersAnswer) {
      throw new InvalidPlayStateError(PlayState.playersAnswer, game.playState!);
    }

    if (game.didAnswer(player)) {
      throw new CannotFlushCardsError('Cannot flush cards after an answer was submitted');
    }

    player.flushCards();

    await this.playerRepository.save(player);

    game = await this.gameService.getGameForPlayer(player.id);

    await this.gameService.dealCards(game);
    await this.gameService.saveAndPublish(game);
  }
}
