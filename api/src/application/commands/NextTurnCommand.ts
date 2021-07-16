import { EventPublisher } from '../../ddd/EventPublisher';
import { DomainEvent } from '../../domain/events';
import { GameRepository } from '../../domain/interfaces/GameRepository';
import { SessionStore } from '../interfaces/SessionStore';
import { GameService } from '../services/GameService';

export class NextTurnCommand {}

export class NextTurnHandler {
  constructor(
    private readonly gameService: GameService,
    private readonly gameRepository: GameRepository,
    private readonly publisher: EventPublisher<DomainEvent>,
  ) {}

  async execute(_: NextTurnCommand, session: SessionStore) {
    const player = session.player!;
    const game = await this.gameService.getGameForPlayer(player.id);

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
