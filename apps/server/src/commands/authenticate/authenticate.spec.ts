import { createPlayer } from 'src/entities';
import { HandlerCommand } from 'src/interfaces';
import { defined } from 'src/utils/defined';
import { UnitTest } from 'src/utils/unit-test';

import { AuthenticateHandler, PlayerAuthenticatedEvent } from './authenticate';

class Test extends UnitTest {
  handler = new AuthenticateHandler(this.generator, this.publisher, this.playerRepository);

  command: HandlerCommand<typeof this.handler> = {
    nick: 'nick',
  };

  constructor() {
    super();

    this.generator.nextId = 'playerId';
  }

  get player() {
    return defined(this.playerRepository.get('playerId'));
  }
}

describe('AuthenticateCommand', () => {
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
    test.playerRepository.set(createPlayer({ id: 'existingPlayerId', nick: 'nick' }));

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
