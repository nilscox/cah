import { GameService } from '../services/GameService';

export class CreateAnswerCommand {
  constructor(public readonly playerId: string, public readonly choicesIds: string[]) {}
}

export class CreateAnswerCommandHandler {
  constructor(private readonly gameService: GameService) {}

  async execute({ playerId, choicesIds }: CreateAnswerCommand) {
    const player = await this.gameService.getPlayer(playerId);
    const game = await this.gameService.getGameForPlayer(playerId);

    const choices = player.getCards(choicesIds);

    game.addAnswer(player, choices);
  }
}
