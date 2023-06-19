import { GameState } from '@cah/shared';

import { StubEventPublisherAdapter } from 'src/adapters';
import { HandlerCommand } from 'src/interfaces';
import { InMemoryGameRepository, InMemoryPlayerRepository } from 'src/persistence';
import { defined } from 'src/utils/defined';

import { AddPlayerHandler, PlayerAddedEvent } from './add-player';

class Test {
  gameRepository = new InMemoryGameRepository();
  playerRepository = new InMemoryPlayerRepository();
  publisher = new StubEventPublisherAdapter();

  handler = new AddPlayerHandler(this.publisher, this.gameRepository, this.playerRepository);

  command: HandlerCommand<typeof this.handler> = {
    gameId: 'gameId',
    playerId: 'playerId',
  };

  constructor() {
    this.gameRepository.set({ id: 'gameId', code: '', state: GameState.idle });
    this.playerRepository.set({ id: 'playerId', nick: '' });
  }

  get game() {
    return defined(this.gameRepository.get('gameId'));
  }

  get player() {
    return defined(this.playerRepository.get('playerId'));
  }
}

describe('addPlayer', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  it('adds a player to a game', async () => {
    await test.handler.execute(test.command);

    expect(test.player).toHaveProperty('gameId', 'gameId');
  });

  it('publishes a PlayerAddedEvent', async () => {
    await test.handler.execute(test.command);

    expect(test.publisher).toContainEqual(new PlayerAddedEvent('gameId', 'playerId'));
  });

  it('prevents adding a player already in a game', async () => {
    test.playerRepository.set({ ...test.player, gameId: 'gameId' });

    await expect(test.handler.execute(test.command)).rejects.toThrow('player is already in a game');
  });

  it('prevents adding a player when the game is already started', async () => {
    test.gameRepository.set({ ...test.game, state: GameState.started });

    await expect(test.handler.execute(test.command)).rejects.toThrow('game is not idle');
  });
});
