import { EventPublisherPort, GeneratorPort } from 'src/adapters';
import { Player } from 'src/entities';
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

export class AuthenticateHandler implements CommandHandler<AuthenticateCommand, string> {
  constructor(
    private readonly generator: GeneratorPort,
    private readonly publisher: EventPublisherPort,
    private readonly playerRepository: PlayerRepository
  ) {}

  async execute(command: AuthenticateCommand): Promise<string> {
    const existingPlayer = await this.playerRepository.findByNick(command.nick);

    if (existingPlayer) {
      return existingPlayer.id;
    }

    const player: Player = {
      id: this.generator.generateId(),
      nick: command.nick,
    };

    await this.playerRepository.save(player);

    this.publisher.publish(new PlayerAuthenticatedEvent(player.id));

    return player.id;
  }
}
