import { Game, GameState } from '@cah/shared';

import { StubEventPublisherAdapter } from '../../../event-publisher/stub-event-publisher.adapter';
import { StubGeneratorAdapter } from '../../../generator/stub-generator.adapter';
import { HandlerCommand } from '../../../interfaces/command-handler';
import { InMemoryGameRepository } from '../../../persistence/repositories/game/in-memory-game.repository';

import { CreateGameHandler, GameCreatedEvent } from './create-game';

class Test {
  generator = new StubGeneratorAdapter();
  gameRepository = new InMemoryGameRepository();
  publisher = new StubEventPublisherAdapter();

  handler = new CreateGameHandler(this.generator, this.publisher, this.gameRepository);

  command: HandlerCommand<typeof this.handler> = {
    creatorId: 'creatorId',
  };

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
    await test.handler.execute(test.command);

    expect(test.publisher).toContainEqual<GameCreatedEvent>({
      entity: 'game',
      entityId: 'gameId',
      creatorId: 'creatorId',
    });
  });
});
