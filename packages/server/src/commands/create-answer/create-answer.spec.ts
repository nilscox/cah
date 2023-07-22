import {
  Answer,
  GameState,
  createAnswer,
  createChoice,
  createPlayer,
  createQuestion,
  createStartedGame,
} from 'src/entities';
import { HandlerCommand } from 'src/interfaces';
import { UnitTest } from 'src/utils/unit-test';

import { AnswerCreatedEvent, CreateAnswerHandler } from './create-answer';

class Test extends UnitTest {
  handler = new CreateAnswerHandler(
    this.generator,
    this.publisher,
    this.gameRepository,
    this.playerRepository,
    this.questionRepository,
    this.choiceRepository,
    this.answerRepository
  );

  command: HandlerCommand<typeof this.handler> = {
    playerId: 'playerId',
    choicesIds: ['choiceId'],
  };

  game = createStartedGame({ id: 'gameId', state: GameState.started, questionId: 'questionId' });
  player = createPlayer({ id: 'playerId', gameId: 'gameId' });
  question = createQuestion({ id: 'questionId', gameId: 'gameId' });
  choice = createChoice({ id: 'choiceId', gameId: 'gameId', playerId: 'playerId' });

  constructor() {
    super();

    this.generator.nextId = 'answerId';

    this.gameRepository.set(this.game);
    this.playerRepository.set(this.player);
    this.questionRepository.set(this.question);
    this.choiceRepository.set(this.choice);
  }
}

describe('CreateAnswerCommand', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  it('creates an answer to a question', async () => {
    await expect(test.handler.execute(test.command)).resolves.toBeUndefined();

    expect(test.answerRepository.get('answerId')).toEqual<Answer>({
      id: 'answerId',
      gameId: 'gameId',
      playerId: 'playerId',
      questionId: 'questionId',
    });

    expect(test.choiceRepository.get('choiceId')).toHaveProperty('answerId', 'answerId');
  });

  it('creates an answer with multiple choices', async () => {
    test.question.blanks = [0, 1];
    test.questionRepository.set(test.question);

    test.choiceRepository.set(createChoice({ id: 'choiceId1', gameId: 'gameId', playerId: 'playerId' }));
    test.choiceRepository.set(createChoice({ id: 'choiceId2', gameId: 'gameId', playerId: 'playerId' }));

    const choicesIds = ['choiceId1', 'choiceId2'];

    await expect(test.handler.execute({ ...test.command, choicesIds })).resolves.toBeUndefined();

    expect(test.choiceRepository.get('choiceId1')).toHaveProperty('answerId', 'answerId');
    expect(test.choiceRepository.get('choiceId2')).toHaveProperty('answerId', 'answerId');
  });

  it('assigns a place to the given choices', async () => {
    test.question.blanks = [0, 1];
    test.questionRepository.set(test.question);

    test.choiceRepository.set(createChoice({ id: 'choiceId1', gameId: 'gameId', playerId: 'playerId' }));
    test.choiceRepository.set(createChoice({ id: 'choiceId2', gameId: 'gameId', playerId: 'playerId' }));

    const choicesIds = ['choiceId1', 'choiceId2'];

    await expect(test.handler.execute({ ...test.command, choicesIds })).resolves.toBeUndefined();

    expect(test.choiceRepository.get('choiceId1')).toHaveProperty('place', 1);
    expect(test.choiceRepository.get('choiceId2')).toHaveProperty('place', 2);
  });

  it('publishes an AnswerCreatedEvent', async () => {
    await expect(test.handler.execute(test.command)).resolves.toBeUndefined();

    expect(test.publisher).toContainEqual(new AnswerCreatedEvent('answerId'));
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

  it('fails when the player is the current question master', async () => {
    test.game.questionMasterId = 'playerId';
    test.gameRepository.set(test.game);

    await expect(test.handler.execute(test.command)).rejects.toThrow('player is the question master');
  });

  it('fails when the player does now own some of the choices', async () => {
    test.choice.playerId = 'otherPlayerId';
    test.choiceRepository.set(test.choice);

    await expect(test.handler.execute(test.command)).rejects.toThrow(
      'player does not own some of the choice'
    );
  });

  it('fails when the player has already submitted an answered', async () => {
    test.answerRepository.set(createAnswer({ gameId: 'gameId', playerId: 'playerId' }));

    await expect(test.handler.execute(test.command)).rejects.toThrow(
      'player has already submitted an answer'
    );
  });

  it("fails when number of choices does not match the question's number of blanks", async () => {
    test.question.blanks = [0, 1];
    test.questionRepository.set(test.question);

    await expect(test.handler.execute(test.command)).rejects.toThrow('invalid number of choices');
  });
});
