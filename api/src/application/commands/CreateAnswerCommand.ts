import { IsInt, IsUUID } from 'class-validator';

import { EventPublisher } from '../../ddd/EventPublisher';
import { GameService } from '../services/GameService';
import { RandomService } from '../services/RandomService';

export class CreateAnswerCommand {
  @IsUUID('4')
  playerId!: string;

  @IsInt({ each: true })
  choicesIds!: string[];

  constructor(playerId: string, choicesIds: string[]) {
    this.playerId = playerId;
    this.choicesIds = choicesIds;
  }
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
