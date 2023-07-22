import assert from 'node:assert';

import { StubEventPublisherAdapter, StubExternalDataAdapter, StubRandomAdapter } from 'src/adapters';
import { GameState, createGame, createPlayer, createQuestion, isStarted } from 'src/entities';
import { HandlerCommand } from 'src/interfaces';
import {
  InMemoryChoiceRepository,
  InMemoryGameRepository,
  InMemoryPlayerRepository,
  InMemoryQuestionRepository,
} from 'src/persistence';
import { defined } from 'src/utils/defined';
import { hasProperty } from 'src/utils/has-property';

import { GameStartedEvent, StartGameHandler } from './start-game';

class Test {
  random = new StubRandomAdapter();
  publisher = new StubEventPublisherAdapter();
  externalData = new StubExternalDataAdapter();
  gameRepository = new InMemoryGameRepository();
  playerRepository = new InMemoryPlayerRepository();
  questionRepository = new InMemoryQuestionRepository();
  choiceRepository = new InMemoryChoiceRepository();

  handler = new StartGameHandler(
    this.random,
    this.publisher,
    this.externalData,
    this.gameRepository,
    this.playerRepository,
    this.questionRepository,
    this.choiceRepository
  );

  command: HandlerCommand<typeof this.handler> = {
    playerId: 'player1Id',
    gameId: 'gameId',
    numberOfQuestions: 1,
  };

  constructor() {
    this.gameRepository.set(createGame({ id: 'gameId' }));
  }

  addPlayer(playerId: string) {
    this.playerRepository.set(createPlayer({ id: playerId, gameId: 'gameId' }));
  }

  get game() {
    return defined(this.gameRepository.get('gameId'));
  }
}

describe('StartGameCommand', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  describe('when the game starts', () => {
    beforeEach(() => {
      test.addPlayer('player1Id');
      test.addPlayer('player2Id');
      test.addPlayer('player3Id');
    });

    it("initializes the game's properties", async () => {
      await test.handler.execute(test.command);

      expect(test.game.state).toEqual(GameState.started);
      assert(isStarted(test.game));

      expect(test.game.questionMasterId).toEqual('player1Id');
      expect(test.game.questionId).toEqual('question1Id');
    });

    it('triggers a GameStartedEvent', async () => {
      await test.handler.execute(test.command);

      expect(test.publisher).toContainEqual(new GameStartedEvent('gameId'));
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
        4 * 11 + 3 * 1 + 3 * 1 + 3 * 2
      );
    });
  });

  it('fails when the game is already started', async () => {
    test.addPlayer('player1Id');

    test.gameRepository.set({ ...test.game, state: GameState.started });

    await expect(test.handler.execute(test.command)).rejects.toThrow('the game has already started');
  });

  it('fails when the player is not part of this game', async () => {
    test.playerRepository.set(createPlayer({ id: 'playerId' }));

    await expect(test.handler.execute({ ...test.command, playerId: 'playerId' })).rejects.toThrow(
      'player is not part of this game'
    );
  });

  it('fails when the game contains less than 3 players', async () => {
    test.addPlayer('player1Id');
    test.addPlayer('player2Id');

    await expect(test.handler.execute(test.command)).rejects.toThrow(
      'there is not enough players to start (min: 3)'
    );
  });
});
