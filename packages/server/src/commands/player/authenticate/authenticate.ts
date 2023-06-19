import { Player } from '@cah/shared';

import { EventPublisherPort, GeneratorPort } from 'src/adapters';
import { CommandHandler, DomainEvent } from 'src/interfaces';
import { PlayerRepository } from 'src/persistence';

export class PlayerAuthenticatedEvent extends DomainEvent {
  constructor(playerId: string) {
    super('player', playerId);
  }
}

type AuthenticateCommand = {
  nick: string;
};

export class AuthenticateHandler implements CommandHandler<AuthenticateCommand> {
  constructor(
    private readonly generator: GeneratorPort,
    private readonly publisher: EventPublisherPort,
    private readonly playerRepository: PlayerRepository
  ) {}

  async execute(command: AuthenticateCommand): Promise<void> {
    const player: Player = {
      id: this.generator.generateId(),
      nick: command.nick,
    };

    await this.playerRepository.save(player);

    this.publisher.publish(new PlayerAuthenticatedEvent(player.id));
  }
}
