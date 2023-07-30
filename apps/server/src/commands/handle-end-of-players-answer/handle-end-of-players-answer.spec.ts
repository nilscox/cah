import { createAnswer, createPlayer } from 'src/entities';
import { HandlerCommand } from 'src/interfaces';
import { array } from 'src/utils/array';
import { UnitTest } from 'src/utils/unit-test';

import { AllAnswersSubmittedEvent, HandleEndOfPlayersAnswerHandler } from './handle-end-of-players-answer';

class Test extends UnitTest {
  handler = new HandleEndOfPlayersAnswerHandler(
    this.publisher,
    this.random,
    this.playerRepository,
    this.answerRepository,
  );

  command: HandlerCommand<typeof this.handler> = {
    answerId: '',
  };

  players = array(3, () => createPlayer({ gameId: 'gameId' }));
  answers = array(2, (i) => createAnswer({ gameId: 'gameId', playerId: this.players[i].id }));

  constructor() {
    super();

    this.playerRepository.set(...this.players);
    this.answerRepository.set(...this.answers);

    this.command.answerId = this.answers[0].id;
  }
}

describe('HandleEndOfPlayersAnswerCommand', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  it('randomizes the answers', async () => {
    await expect(test.handler.execute(test.command)).resolves.toBeUndefined();

    expect(test.answerRepository.all().map((answer) => answer.place)).toEqual([1, 2]);
  });

  it('publishes an AllAnswersSubmittedEvent', async () => {
    await expect(test.handler.execute(test.command)).resolves.toBeUndefined();

    expect(test.publisher).toContainEqual(new AllAnswersSubmittedEvent('gameId'));
  });

  it('does nothing if not all players answered', async () => {
    test.playerRepository.set(createPlayer({ gameId: 'gameId' }));

    await expect(test.handler.execute(test.command)).resolves.toBeUndefined();

    expect(test.publisher).toHaveLength(0);
  });
});
