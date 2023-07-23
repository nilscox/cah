import { GameState, createGame, createPlayer } from 'src/entities';
import { HandlerCommand } from 'src/interfaces';
import { UnitTest } from 'src/utils/unit-test';

import { LeaveGameHandler, PlayerLeftEvent } from './leave-game';

class Test extends UnitTest {
  handler = new LeaveGameHandler(this.publisher, this.gameRepository, this.playerRepository);

  command: HandlerCommand<typeof this.handler> = {
    playerId: 'playerId',
  };

  game = createGame({ id: 'gameId', state: GameState.finished });
  player = createPlayer({ id: 'playerId', gameId: 'gameId' });

  constructor() {
    super();

    this.gameRepository.set(this.game);
    this.playerRepository.set(this.player);
  }
}

describe('LeaveGameCommand', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  it('removes a player from a game', async () => {
    await test.handler.execute(test.command);

    expect(test.playerRepository.get('playerId')).not.toHaveProperty('gameId');
  });

  it('publishes a PlayerLeftEvent', async () => {
    await test.handler.execute(test.command);

    expect(test.publisher).toContainEqual(new PlayerLeftEvent('gameId', 'playerId'));
  });

  it('fails when the player is not in a game', async () => {
    delete test.player.gameId;
    test.playerRepository.set(test.player);

    await expect(test.handler.execute(test.command)).rejects.toThrow('player is not in a game');
  });

  it('fails when he game is not finished', async () => {
    test.game.state = GameState.started;
    test.gameRepository.set(test.game);

    await expect(test.handler.execute(test.command)).rejects.toThrow('game is not finished');
  });
});
