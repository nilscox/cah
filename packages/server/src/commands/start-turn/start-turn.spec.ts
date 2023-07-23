import { GameState, createQuestion, createStartedGame } from 'src/entities';
import { HandlerCommand } from 'src/interfaces';
import { UnitTest } from 'src/utils/unit-test';

import { StartTurnHandler, TurnStartedEvent } from './start-turn';

class Test extends UnitTest {
  handler = new StartTurnHandler(this.publisher, this.gameRepository, this.questionRepository);

  command: HandlerCommand<typeof this.handler> = {
    gameId: 'gameId',
    questionMasterId: 'playerId2',
  };

  game = createStartedGame({
    id: 'gameId',
    questionMasterId: 'playerId1',
    questionId: 'questionId1',
    selectedAnswerId: 'answerId',
  });

  question = createQuestion({ id: 'nextQuestionId', gameId: 'gameId' });

  constructor() {
    super();

    this.gameRepository.set(this.game);
    this.questionRepository.set(this.question);
  }
}

describe('StartTurnCommand', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  it('sets the question master', async () => {
    await expect(test.handler.execute(test.command)).resolves.toBeUndefined();

    expect(test.gameRepository.get('gameId')).toHaveProperty('questionMasterId', 'playerId2');
  });

  it('sets the next question', async () => {
    await expect(test.handler.execute(test.command)).resolves.toBeUndefined();

    expect(test.gameRepository.get('gameId')).toHaveProperty('questionId', 'nextQuestionId');
  });

  it('clears the selected answer', async () => {
    await expect(test.handler.execute(test.command)).resolves.toBeUndefined();

    expect(test.gameRepository.get('gameId')).not.toHaveProperty('selectedAnswer');
  });

  it('publishes a TurnStartedEvent', async () => {
    await expect(test.handler.execute(test.command)).resolves.toBeUndefined();

    expect(test.publisher).toContainEqual(new TurnStartedEvent('gameId'));
  });

  it('fails when the game is not started', async () => {
    test.game.state = GameState.idle;
    test.gameRepository.set(test.game);

    await expect(test.handler.execute(test.command)).rejects.toThrow('game is not started');
  });

  it('fails when there is no more question', async () => {
    test.question.gameId = 'otherGameId';
    test.questionRepository.set(test.question);

    await expect(test.handler.execute(test.command)).rejects.toThrow('there is no more question');
  });
});
