import { EventPublisher } from '../../ddd/EventPublisher';
import { GameService } from '../services/GameService';
import { RandomService } from '../services/RandomService';

export class CreateAnswerCommand {
  constructor(public readonly playerId: string, public readonly choicesIds: string[]) {}
}

export class CreateAnswerCommandHandler {
  constructor(
    private readonly gameService: GameService,
    private readonly randomService: RandomService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute({ playerId, choicesIds }: CreateAnswerCommand) {
    const player = await this.gameService.getPlayer(playerId);
    const game = await this.gameService.getGameForPlayer(playerId);

    const choices = player.getCards(choicesIds);

    game.addAnswer(player, choices, this.randomService.randomize);

    game.publishEvents(this.publisher);
  }
}
