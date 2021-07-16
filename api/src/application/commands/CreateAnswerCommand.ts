import { IsUUID } from 'class-validator';

import { EventPublisher } from '../../ddd/EventPublisher';
import { DomainEvent } from '../../domain/events';
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

export class CreateAnswerHandler {
  constructor(
    private readonly gameService: GameService,
    private readonly randomService: RandomService,
    private readonly publisher: EventPublisher<DomainEvent>,
  ) {}

  async execute({ choicesIds }: CreateAnswerCommand, session: SessionStore) {
    const player = session.player!;
    const game = await this.gameService.getGameForPlayer(player.id);

    const choices = player.getCards(choicesIds);

    game.addAnswer(player, choices, this.randomService.randomize);

    game.publishEvents(this.publisher);
  }
}
