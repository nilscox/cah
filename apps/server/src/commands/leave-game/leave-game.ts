import assert from 'node:assert';

import { injectableClass } from 'ditox';

import { EventPublisherPort } from 'src/adapters';
import { GameState } from 'src/entities';
import { CommandHandler, DomainEvent } from 'src/interfaces';
import { GameRepository, PlayerRepository } from 'src/persistence';
import { TOKENS } from 'src/tokens';

export class PlayerLeftEvent extends DomainEvent {
  constructor(
    gameId: string,
    public readonly playerId: string,
  ) {
    super('game', gameId);
  }
}

type LeaveGameCommand = {
  playerId: string;
};

export class LeaveGameHandler implements CommandHandler<LeaveGameCommand> {
  static inject = injectableClass(
    this,
    TOKENS.publisher,
    TOKENS.repositories.game,
    TOKENS.repositories.player,
  );

  constructor(
    private publisher: EventPublisherPort,
    private gameRepository: GameRepository,
    private playerRepository: PlayerRepository,
  ) {}

  async execute(command: LeaveGameCommand): Promise<void> {
    const player = await this.playerRepository.findById(command.playerId);
    assert(player.gameId, 'player is not in a game');

    const game = await this.gameRepository.findById(player.gameId);
    assert(game.state === GameState.finished, 'game is not finished');

    delete player.gameId;

    await this.playerRepository.update(player);

    this.publisher.publish(new PlayerLeftEvent(game.id, player.id));
  }
}
