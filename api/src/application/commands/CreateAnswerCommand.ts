import { IsUUID } from 'class-validator';

import { CommandHandler } from '../../ddd/CommandHandler';
import { SessionStore } from '../interfaces/SessionStore';
import { GameService } from '../services/GameService';
import { RandomService } from '../services/RandomService';

export class CreateAnswerCommand {
  @IsUUID('4', { each: true })
  choicesIds: string[];

  constructor(choicesIds: string[]) {
    this.choicesIds = choicesIds;
  }
}

export class CreateAnswerHandler implements CommandHandler<CreateAnswerCommand, void, SessionStore> {
  constructor(private readonly gameService: GameService, private readonly randomService: RandomService) {}

  async execute({ choicesIds }: CreateAnswerCommand, session: SessionStore) {
    const player = session.player!;
    const game = await this.gameService.getGameForPlayer(player.id);

    const choices = player.getCards(choicesIds);

    game.addAnswer(player, choices, this.randomService.randomize);

    await this.gameService.saveAndPublish(game);
  }
}
