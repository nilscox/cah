import { Game, GameState, createPlayer } from 'src/entities';
import { HandlerCommand } from 'src/interfaces';
import { UnitTest } from 'src/utils/unit-test';

import { CreateGameHandler, GameCreatedEvent } from './create-game';

class Test extends UnitTest {
  handler = new CreateGameHandler(this.generator, this.publisher, this.playerRepository, this.gameRepository);

  command: HandlerCommand<typeof this.handler> = {
    playerId: 'creatorId',
  };

  constructor() {
    super();

    this.generator.nextId = 'gameId';
    this.playerRepository.set(createPlayer({ id: 'creatorId' }));
  }

  get game() {
    return this.gameRepository.get('gameId');
  }
}

describe('CreateGameCommand', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  it('creates a new game', async () => {
    test.command.code = 'CAFE';

    await test.handler.execute(test.command);

    expect(test.game).toEqual<Game>({
      id: 'gameId',
      code: 'CAFE',
      state: GameState.idle,
    });
  });

  it('generates a random game code', async () => {
    test.generator.nextGameCode = 'COCA';

    await test.handler.execute(test.command);

    expect(test.game).toHaveProperty('code', 'COCA');
  });

  it('publishes a GameCreatedEvent', async () => {
    test.generator.nextGameCode = 'CODE';

    await test.handler.execute(test.command);

    expect(test.publisher).toContainEqual(new GameCreatedEvent('gameId', 'CODE', 'creatorId'));
  });

  it('prevents creating a game when already in a game', async () => {
    test.playerRepository.set(createPlayer({ id: 'creatorId', gameId: 'gameId' }));

    await expect(test.handler.execute(test.command)).rejects.toThrow('player is already in a game');
  });
});
