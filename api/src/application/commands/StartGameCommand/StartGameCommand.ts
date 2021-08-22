import { IsInt, IsUUID, Min, ValidateIf } from 'class-validator';

import { CommandHandler } from '../../../ddd/CommandHandler';
import { Game } from '../../../domain/models/Game';
import { Player } from '../../../domain/models/Player';
import { ExternalData } from '../../../infrastructure/ExternalData';
import { GameRepository } from '../../interfaces/GameRepository';
import { SessionStore } from '../../interfaces/SessionStore';
import { GameService } from '../../services/GameService';
import { RandomService } from '../../services/RandomService';

export class StartGameCommand {
  @ValidateIf((_, value) => value !== null)
  @IsUUID('4')
  public readonly questionMasterId: string | null;

  @IsInt()
  @Min(1)
  public readonly turns: number;

  constructor(questionMasterId: string | null, turns: number) {
    this.questionMasterId = questionMasterId;
    this.turns = turns;
  }
}

export class StartGameHandler implements CommandHandler<StartGameCommand, void, SessionStore> {
  constructor(
    private readonly gameService: GameService,
    private readonly gameRepository: GameRepository,
    private readonly externalData: ExternalData,
    private readonly randomService: RandomService,
  ) {}

  async execute({ questionMasterId, turns }: StartGameCommand, session: SessionStore) {
    const player = session.player!;

    const game = await this.gameService.getGameForPlayer(player.id);
    const questionMaster = await this.getInitialQuestionMaster(game.players, questionMasterId);

    const [questions] = await this.getCards(game, turns);

    game.start(questionMaster, questions[0]);
    await this.gameService.dealCards(game);

    await this.gameService.saveAndPublish(game);
  }

  private async getInitialQuestionMaster(players: Player[], questionMasterId: string | null): Promise<Player> {
    if (questionMasterId) {
      return this.gameService.getPlayer(questionMasterId);
    }

    return this.randomService.randomize(players)[0];
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
