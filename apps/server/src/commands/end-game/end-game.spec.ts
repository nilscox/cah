import { GameState, createStartedGame } from 'src/entities';
import { HandlerCommand } from 'src/interfaces';
import { UnitTest } from 'src/utils/unit-test';

import { EndGameHandler, GameEndedEvent } from './end-game';

class Test extends UnitTest {
  handler = new EndGameHandler(this.publisher, this.gameRepository, this.playerRepository);

  command: HandlerCommand<typeof this.handler> = {
    gameId: 'gameId',
  };

  game = createStartedGame({ id: 'gameId', state: GameState.started });

  constructor() {
    super();

    this.gameRepository.set(this.game);
  }
}

describe('EndGameCommand', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  it('ends the game', async () => {
    await expect(test.handler.execute(test.command)).resolves.toBeUndefined();

    expect(test.gameRepository.get('gameId')).toHaveProperty('state', GameState.finished);
  });

  it('publishes a GameEndedEvent', async () => {
    await expect(test.handler.execute(test.command)).resolves.toBeUndefined();

    expect(test.publisher).toContainEqual(new GameEndedEvent('gameId'));
  });

  it('fails when the game is not started', async () => {
    test.game.state = GameState.idle;
    test.gameRepository.set(test.game);

    await expect(test.handler.execute(test.command)).rejects.toThrow('game is not started');
  });
});
