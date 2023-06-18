import { Game, GameState } from '@cah/shared';

import { StubGeneratorAdapter } from '../../generator/stub-generator.adapter';
import { InMemoryGameRepository } from '../../persistence/repositories/game/in-memory-game.repository';

import { CreateGameHandler } from './create-game';

class Test {
  generator = new StubGeneratorAdapter();
  gameRepository = new InMemoryGameRepository();

  handler = new CreateGameHandler(this.generator, this.gameRepository);

  constructor() {
    this.generator.nextId = 'gameId';
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
    await test.handler.execute({ code: 'CAFE' });

    expect(await test.game).toEqual<Game>({
      id: 'gameId',
      code: 'CAFE',
      state: GameState.idle,
    });
  });

  it('generates a random game code', async () => {
    test.generator.nextGameCode = 'COCA';

    await test.handler.execute({});

    expect(await test.game).toHaveProperty('code', 'COCA');
  });
});
