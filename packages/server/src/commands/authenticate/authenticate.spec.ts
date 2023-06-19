import { StubEventPublisherAdapter, StubGeneratorAdapter } from 'src/adapters';
import { HandlerCommand } from 'src/interfaces';
import { InMemoryPlayerRepository } from 'src/persistence';
import { defined } from 'src/utils/defined';

import { AuthenticateHandler, PlayerAuthenticatedEvent } from './authenticate';

class Test {
  generator = new StubGeneratorAdapter();
  publisher = new StubEventPublisherAdapter();
  playerRepository = new InMemoryPlayerRepository();

  handler = new AuthenticateHandler(this.generator, this.publisher, this.playerRepository);

  command: HandlerCommand<typeof this.handler> = {
    nick: 'nick',
  };

  constructor() {
    this.generator.nextId = 'playerId';
  }

  get player() {
    return defined(this.playerRepository.get('playerId'));
  }
}

describe('authenticate', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  it('authenticates as a new player', async () => {
    await test.handler.execute(test.command);

    expect(test.player).toBeDefined();
    expect(test.player).toHaveProperty('nick', 'nick');
  });

  it('authenticates as an existing player', async () => {
    test.playerRepository.set({ id: 'existingPlayerId', nick: 'nick' });

    await expect(test.handler.execute(test.command)).resolves.toEqual('existingPlayerId');
  });

  it("returns the player's id", async () => {
    await expect(test.handler.execute(test.command)).resolves.toEqual('playerId');
  });

  it('publishes a PlayerAuthenticatedEvent', async () => {
    await test.handler.execute(test.command);

    expect(test.publisher).toContainEqual(new PlayerAuthenticatedEvent('playerId'));
  });
});
