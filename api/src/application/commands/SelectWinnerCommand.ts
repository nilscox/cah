import { EventPublisher } from '../../ddd/EventPublisher';
import { GameService } from '../services/GameService';

export class SelectWinnerCommand {
  constructor(public readonly playerId: string, public readonly answerId: string) {}
}

export class SelectWinnerHandler {
  constructor(private readonly gameService: GameService, private readonly publisher: EventPublisher) {}

  async execute({ playerId, answerId }: SelectWinnerCommand) {
    const player = await this.gameService.getPlayer(playerId);
    const game = await this.gameService.getGameForPlayer(playerId);

    game.setWinningAnswer(player, answerId);

    game.publishEvents(this.publisher);
  }
}
