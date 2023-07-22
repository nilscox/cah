import { GameState, createAnswer, createPlayer, createStartedGame } from 'src/entities';
import { HandlerCommand } from 'src/interfaces';
import { UnitTest } from 'src/utils/unit-test';

import { AnswerSelectedEvent, SelectWinningAnswerHandler } from './select-winning-answer';

class Test extends UnitTest {
  handler = new SelectWinningAnswerHandler(
    this.publisher,
    this.gameRepository,
    this.playerRepository,
    this.answerRepository
  );

  command: HandlerCommand<typeof this.handler> = {
    playerId: 'questionMasterId',
    answerId: 'answerId',
  };

  game = createStartedGame({ id: 'gameId', questionMasterId: 'questionMasterId' });
  questionMaster = createPlayer({ id: 'questionMasterId', gameId: 'gameId' });
  player = createPlayer({ id: 'playerId', gameId: 'gameId' });
  answer = createAnswer({ id: 'answerId', gameId: 'gameId', playerId: 'playerId' });

  constructor() {
    super();

    this.gameRepository.set(this.game);
    this.playerRepository.set(this.questionMaster);
    this.playerRepository.set(this.player);
    this.answerRepository.set(this.answer);
  }
}

describe('SelectWinningAnswerCommand', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  it('selects an answer', async () => {
    await expect(test.handler.execute(test.command)).resolves.toBeUndefined();

    expect(test.gameRepository.get('gameId')).toHaveProperty('selectedAnswerId', 'answerId');
  });

  it('publishes an AnswerSelectedEvent', async () => {
    await expect(test.handler.execute(test.command)).resolves.toBeUndefined();

    expect(test.publisher).toContainEqual(new AnswerSelectedEvent('gameId'));
  });

  it('fails when the player is not in a game', async () => {
    delete test.questionMaster.gameId;
    test.playerRepository.set(test.questionMaster);

    await expect(test.handler.execute(test.command)).rejects.toThrow('player is not in a game');
  });

  it('fails when the game is not started', async () => {
    test.game.state = GameState.idle;
    test.gameRepository.set(test.game);

    await expect(test.handler.execute(test.command)).rejects.toThrow('game is not started');
  });

  it('fails when the player is not the current question master', async () => {
    test.command.playerId = 'playerId';

    await expect(test.handler.execute(test.command)).rejects.toThrow('player is not the question master');
  });

  it('fails when not all players have submitted an answer', async () => {
    test.playerRepository.set(createPlayer({ gameId: 'gameId' }));

    await expect(test.handler.execute(test.command)).rejects.toThrow(
      'not all player have submitted an answer'
    );
  });

  it('fails when the given answerId is not valid', async () => {
    test.command.answerId = 'otherAnswerId';

    await expect(test.handler.execute(test.command)).rejects.toThrow('invalid answerId');
  });

  it('fails when an answer was already submitted', async () => {
    test.game.selectedAnswerId = 'answerId';
    test.gameRepository.set(test.game);

    await expect(test.handler.execute(test.command)).rejects.toThrow('an answer was already selected');
  });
});
