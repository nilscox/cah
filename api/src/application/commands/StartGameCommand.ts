import { EventPublisher } from '../../ddd/EventPublisher';
import { ExternalData } from '../../domain/interfaces/ExternalData';
import { GameRepository } from '../../domain/interfaces/GameRepository';
import { Game } from '../../domain/models/Game';
import { GameService } from '../services/GameService';

export class StartGameCommand {
  constructor(public readonly questionMasterId: string, public readonly turns: number) {}
}

export class StartGameHandler {
  constructor(
    private readonly gameService: GameService,
    private readonly gameRepository: GameRepository,
    private readonly externalData: ExternalData,
    private readonly publisher: EventPublisher,
  ) {}

  async execute({ questionMasterId, turns }: StartGameCommand) {
    const game = await this.gameService.getGameForPlayer(questionMasterId);
    const questionMaster = await this.gameService.getPlayer(questionMasterId);

    const [questions, choices] = await this.getCards(game, turns);

    await game.start(questionMaster, questions[0]);
    await game.dealCards([...choices]);

    game.publishEvents(this.publisher);
  }

  private async getCards(game: Game, turns: number) {
    const questions = await this.externalData.pickRandomQuestions(turns);
    const choices = await this.externalData.pickRandomChoices(game.computeNeededChoicesCount(questions));

    await this.gameRepository.addQuestions(game.id, questions);
    await this.gameRepository.addChoices(game.id, choices);

    return [questions, choices] as const;
  }
}
