import { EventPublisher } from '../../ddd/EventPublisher';
import { GameRepository } from '../../domain/interfaces/GameRepository';
import { GameService } from '../services/GameService';

export class NextTurnCommand {
  constructor(public readonly playerId: string) {}
}

export class NextTurnHandler {
  constructor(
    private readonly gameService: GameService,
    private readonly gameRepository: GameRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute({ playerId }: NextTurnCommand) {
    const game = await this.gameService.getGameForPlayer(playerId);
    const nextQuestion = await this.gameRepository.findNextAvailableQuestion(game.id);
    const availableChoices = await this.gameRepository.findAvailableChoices(game.id);

    await this.gameRepository.addTurn(game.id, game.currentTurn);

    if (nextQuestion) {
      game.nextTurn(nextQuestion);
      game.dealCards(availableChoices);
    } else {
      game.finish();
    }

    game.publishEvents(this.publisher);
  }
}
