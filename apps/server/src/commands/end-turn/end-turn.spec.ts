import { GameState, Turn, createAnswer, createPlayer, createStartedGame } from 'src/entities';
import { HandlerCommand } from 'src/interfaces';
import { UnitTest } from 'src/utils/unit-test';

import { EndTurnHandler, TurnEndedEvent } from './end-turn';

class Test extends UnitTest {
  handler = new EndTurnHandler(
    this.generator,
    this.publisher,
    this.gameRepository,
    this.playerRepository,
    this.questionRepository,
    this.answerRepository,
    this.turnRepository,
  );

  command: HandlerCommand<typeof this.handler> = {
    playerId: 'playerId',
  };

  game = createStartedGame({
    id: 'gameId',
    state: GameState.started,
    questionMasterId: 'questionMasterId',
    questionId: 'questionId',
    selectedAnswerId: 'answerId',
  });

  player = createPlayer({ id: 'playerId', gameId: 'gameId' });
  answer = createAnswer({ id: 'answerId', gameId: 'gameId', playerId: 'winnerId' });

  constructor() {
    super();

    this.generator.nextId = 'turnId';

    this.gameRepository.set(this.game);
    this.playerRepository.set(this.player);
    this.answerRepository.set(this.answer);
  }
}

describe('EndTurnCommand', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  it('ends the current turn', async () => {
    await expect(test.handler.execute(test.command)).resolves.toBeUndefined();

    expect(test.turnRepository.get('turnId')).toEqual<Turn>({
      id: 'turnId',
      gameId: 'gameId',
      questionMasterId: 'questionMasterId',
      questionId: 'questionId',
      selectedAnswerId: 'answerId',
    });

    expect(test.answerRepository.get('answerId')).toHaveProperty('turnId', 'turnId');
  });

  it('publishes a TurnEndedEvent', async () => {
    await expect(test.handler.execute(test.command)).resolves.toBeUndefined();

    expect(test.publisher).toContainEqual(new TurnEndedEvent('gameId', 'winnerId', false));
  });

  it('fails when the player is not in a game', async () => {
    delete test.player.gameId;
    test.playerRepository.set(test.player);

    await expect(test.handler.execute(test.command)).rejects.toThrow('player is not in a game');
  });

  it('fails when the game is not started', async () => {
    test.game.state = GameState.idle;
    test.gameRepository.set(test.game);

    await expect(test.handler.execute(test.command)).rejects.toThrow('game is not started');
  });

  it('fails when no answer was selected', async () => {
    delete test.game.selectedAnswerId;
    test.gameRepository.set(test.game);

    await expect(test.handler.execute(test.command)).rejects.toThrow('no answer was selected');
  });
});
