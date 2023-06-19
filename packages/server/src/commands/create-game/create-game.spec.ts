import { Game, GameState } from '@cah/shared';

import { StubEventPublisherAdapter, StubGeneratorAdapter } from 'src/adapters';
import { HandlerCommand } from 'src/interfaces';
import { InMemoryGameRepository, InMemoryPlayerRepository } from 'src/persistence';

import { CreateGameHandler, GameCreatedEvent } from './create-game';

class Test {
  generator = new StubGeneratorAdapter();
  gameRepository = new InMemoryGameRepository();
  playerRepository = new InMemoryPlayerRepository();
  publisher = new StubEventPublisherAdapter();

  handler = new CreateGameHandler(this.generator, this.publisher, this.playerRepository, this.gameRepository);

  command: HandlerCommand<typeof this.handler> = {
    playerId: 'creatorId',
  };

  constructor() {
    this.generator.nextId = 'gameId';
    this.playerRepository.set({ id: 'creatorId', nick: '' });
  }

  get game() {
    return this.gameRepository.findById('gameId');
  }
}

describe('createGame', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  it('creates a new game', async () => {
    test.command.code = 'CAFE';

    await test.handler.execute(test.command);

    expect(await test.game).toEqual<Game>({
      id: 'gameId',
      code: 'CAFE',
      state: GameState.idle,
    });
  });

  it('generates a random game code', async () => {
    test.generator.nextGameCode = 'COCA';

    await test.handler.execute(test.command);

    expect(await test.game).toHaveProperty('code', 'COCA');
  });

  it('publishes a GameCreatedEvent', async () => {
    test.generator.nextGameCode = 'CODE';

    await test.handler.execute(test.command);

    expect(test.publisher).toContainEqual(new GameCreatedEvent('gameId', 'CODE', 'creatorId'));
  });

  it('prevents creating a game when already in a game', async () => {
    test.playerRepository.set({ id: 'creatorId', nick: '', gameId: 'gameId' });

    await expect(test.handler.execute(test.command)).rejects.toThrow('player is already in a game');
  });
});
