import { GameState, createGame, createPlayer, createQuestion } from 'src/entities';
import { HandlerCommand } from 'src/interfaces';
import { hasProperty } from 'src/utils/has-property';
import { UnitTest } from 'src/utils/unit-test';

import { GameStartedEvent, StartGameHandler } from './start-game';

class Test extends UnitTest {
  handler = new StartGameHandler(
    this.random,
    this.publisher,
    this.externalData,
    this.gameRepository,
    this.playerRepository,
    this.questionRepository,
    this.choiceRepository,
  );

  command: HandlerCommand<typeof this.handler> = {
    playerId: 'playerId1',
    numberOfQuestions: 1,
  };

  game = createGame({ id: 'gameId', state: GameState.idle });

  constructor() {
    super();

    this.gameRepository.set(this.game);
  }

  addPlayer(playerId: string) {
    this.playerRepository.set(createPlayer({ id: playerId, gameId: 'gameId' }));
  }
}

describe('StartGameCommand', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  describe('when the game starts', () => {
    beforeEach(() => {
      test.addPlayer('playerId1');
      test.addPlayer('playerId2');
      test.addPlayer('playerId3');
    });

    it('starts a game', async () => {
      await test.handler.execute(test.command);

      expect(test.gameRepository.get('gameId')).toHaveProperty('state', GameState.started);
    });

    it('triggers a GameStartedEvent', async () => {
      await test.handler.execute(test.command);

      expect(test.publisher).toContainEqual(new GameStartedEvent('gameId', 'playerId1'));
    });

    it('computes the number of cards', async () => {
      test.addPlayer('player4Id');

      // 5 blanks
      test.externalData.questions = [
        createQuestion(),
        createQuestion({ blanks: [0] }),
        createQuestion({ blanks: [1, 2] }),
      ];

      await test.handler.execute(test.command);

      expect(test.questionRepository.filter(hasProperty('gameId', 'gameId'))).toHaveLength(3);
      expect(test.choiceRepository.filter(hasProperty('gameId', 'gameId'))).toHaveLength(
        4 * 11 + 3 * 1 + 3 * 1 + 3 * 2,
      );
    });
  });

  it('fails when the player is not in a game', async () => {
    test.playerRepository.set(createPlayer({ id: 'playerId' }));
    test.command.playerId = 'playerId';

    await expect(test.handler.execute(test.command)).rejects.toThrow('player is not in a game');
  });

  it('fails when the game is already started', async () => {
    test.addPlayer('playerId1');

    test.game.state = GameState.started;
    test.gameRepository.set(test.game);

    await expect(test.handler.execute(test.command)).rejects.toThrow('game has already started');
  });

  it('fails when the game contains less than 3 players', async () => {
    test.addPlayer('playerId1');
    test.addPlayer('playerId2');

    await expect(test.handler.execute(test.command)).rejects.toThrow(
      'there is not enough players to start (min: 3)',
    );
  });
});
