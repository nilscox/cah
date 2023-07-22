import { injectableClass } from 'ditox';

import { EventPublisherPort, GeneratorPort } from 'src/adapters';
import { Game, GameState } from 'src/entities';
import { CommandHandler, DomainEvent } from 'src/interfaces';
import { GameRepository, PlayerRepository } from 'src/persistence';
import { TOKENS } from 'src/tokens';

export class GameCreatedEvent extends DomainEvent {
  constructor(
    gameId: string,
    public readonly gameCode: string,
    public readonly creatorId: string,
  ) {
    super('game', gameId);
  }
}

type CreateGameCommand = {
  playerId: string;
  code?: string;
};

export class CreateGameHandler implements CommandHandler<CreateGameCommand> {
  static inject = injectableClass(
    this,
    TOKENS.generator,
    TOKENS.publisher,
    TOKENS.repositories.player,
    TOKENS.repositories.game,
  );

  constructor(
    private generator: GeneratorPort,
    private publisher: EventPublisherPort,
    private playerRepository: PlayerRepository,
    private gameRepository: GameRepository,
  ) {}

  async execute(command: CreateGameCommand): Promise<void> {
    const player = await this.playerRepository.findById(command.playerId);

    if (player.gameId) {
      throw new Error('player is already in a game');
    }

    const game: Game = {
      id: this.generator.generateId(),
      code: command.code ?? this.generator.generateGameCode(),
      state: GameState.idle,
    };

    await this.gameRepository.insert(game);

    this.publisher.publish(new GameCreatedEvent(game.id, game.code, player.id));
  }
}
