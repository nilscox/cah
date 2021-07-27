import { IsInt, IsUUID, Min } from 'class-validator';

import { CommandHandler } from '../../ddd/CommandHandler';
import { Game } from '../../domain/models/Game';
import { ExternalData } from '../../infrastructure/ExternalData';
import { GameRepository } from '../interfaces/GameRepository';
import { SessionStore } from '../interfaces/SessionStore';
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

export class StartGameHandler implements CommandHandler<StartGameCommand, void, SessionStore> {
  constructor(
    private readonly gameService: GameService,
    private readonly gameRepository: GameRepository,
    private readonly externalData: ExternalData,
  ) {}

  async execute({ questionMasterId, turns }: StartGameCommand, session: SessionStore) {
    const player = session.player!;

    const game = await this.gameService.getGameForPlayer(player.id);
    // todo: check that the question master is in the game
    const questionMaster = await this.gameService.getPlayer(questionMasterId);

    const [questions, choices] = await this.getCards(game, turns);

    game.start(questionMaster, questions[0]);
    game.dealCards([...choices]);

    await this.gameService.saveAndPublish(game);
  }

  private async getCards(game: Game, turns: number) {
    // todo: handle not enough questions
    const questions = await this.externalData.pickRandomQuestions(turns);
    const choices = await this.externalData.pickRandomChoices(game.computeNeededChoicesCount(questions));

    await this.gameRepository.addQuestions(game.id, questions);
    await this.gameRepository.addChoices(game.id, choices);

    return [questions, choices] as const;
  }
}
