import { TestRepository } from '../../test-repository';

import { SqlQuestionRepository } from './sql-question.repository';

describe('SqlQuestionRepository', () => {
  let test: TestRepository;
  let repository: SqlQuestionRepository;

  beforeEach(async () => {
    test = new TestRepository();
    repository = new SqlQuestionRepository(test.db);

    await test.setup();
  });

  describe('findNextAvailableQuestion', () => {
    it('finds the next available question', async () => {
      const game = await test.create.game();
      const question = await test.create.question({ gameId: game.id });

      const result = await repository.findNextAvailableQuestion(game.id);

      expect(result).toEqual(question);
    });

    it('does not return a question that is in a turn', async () => {
      const game = await test.create.game();
      const player = await test.create.player({ gameId: game.id });
      const question1 = await test.create.question({ gameId: game.id });
      const question2 = await test.create.question({ gameId: game.id });

      const answer = await test.create.answer({
        gameId: game.id,
        playerId: player.id,
        questionId: question1.id,
      });

      await test.create.turn({
        gameId: game.id,
        questionMasterId: player.id,
        questionId: question1.id,
        selectedAnswerId: answer.id,
      });

      const result = await repository.findNextAvailableQuestion(game.id);

      expect(result).toEqual(question2);
    });

    it('returns undefined when there is no more question', async () => {
      const game = await test.create.game();
      const player = await test.create.player({ gameId: game.id });
      const question = await test.create.question({ gameId: game.id });

      const answer = await test.create.answer({
        gameId: game.id,
        playerId: player.id,
        questionId: question.id,
      });

      await test.create.turn({
        gameId: game.id,
        questionMasterId: player.id,
        questionId: question.id,
        selectedAnswerId: answer.id,
      });

      const result = await repository.findNextAvailableQuestion(game.id);

      expect(result).toBeUndefined();
    });
  });
});
