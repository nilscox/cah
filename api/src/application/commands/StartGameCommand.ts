import { IsInt, IsUUID, Min } from 'class-validator';

import { EventPublisher } from '../../ddd/EventPublisher';
import { DomainEvent } from '../../domain/events';
import { ExternalData } from '../../domain/interfaces/ExternalData';
import { GameRepository } from '../../domain/interfaces/GameRepository';
import { Game } from '../../domain/models/Game';
import { GameService } from '../services/GameService';

export class StartGameCommand {
  @IsUUID('4')
  public readonly questionMasterId: string;

  @IsInt()
  @Min(1)
  public readonly turns: number;

  constructor(questionMasterId: string, turns: number) {
    this.questionMasterId = questionMasterId;
    this.turns = turns;
  }
}

export class StartGameHandler {
  constructor(
    private readonly gameService: GameService,
    private readonly gameRepository: GameRepository,
    private readonly externalData: ExternalData,
    private readonly publisher: EventPublisher<DomainEvent>,
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
