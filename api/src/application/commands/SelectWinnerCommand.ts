import { IsUUID } from 'class-validator';

import { EventPublisher } from '../../ddd/EventPublisher';
import { DomainEvent } from '../../domain/events';
import { SessionStore } from '../interfaces/SessionStore';
import { GameService } from '../services/GameService';

export class SelectWinnerCommand {
  @IsUUID('4')
  public readonly answerId: string;

  constructor(answerId: string) {
    this.answerId = answerId;
  }
}

export class SelectWinnerHandler {
  constructor(private readonly gameService: GameService, private readonly publisher: EventPublisher<DomainEvent>) {}

  async execute({ answerId }: SelectWinnerCommand, session: SessionStore) {
    const player = session.player!;
    const game = await this.gameService.getGameForPlayer(player.id);

    game.setWinningAnswer(player, answerId);

    game.publishEvents(this.publisher);
  }
}
