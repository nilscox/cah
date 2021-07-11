import { expect } from 'chai';
import { getCustomRepository, getRepository, Repository } from 'typeorm';

import { GameEntity } from '../entities/GameEntity';
import { createGame, createPlayer, createQuestion, createTestDatabase, createTurn } from '../test-utils';

import { SQLQuestionRepository } from './SQLQuestionRepository';

describe('SQLGameRepository', () => {
  let gameRepository: Repository<GameEntity>;
  let repository: SQLQuestionRepository;

  createTestDatabase();

  before(() => {
    gameRepository = getRepository(GameEntity);
    repository = getCustomRepository(SQLQuestionRepository);
  });

  describe('getNextAvailableQuestion', () => {
    it('returns the first question', async () => {
      const game = await createGame();
      const question = await createQuestion({ game });

      const nextQuestion = await repository.getNextAvailableQuestion(game);

      expect(nextQuestion?.id).to.eql(question.id);
    });

    it('returns the first question that is not the current question', async () => {
      const game = await createGame();

      const question1 = await createQuestion({ game });
      const question2 = await createQuestion({ game });

      game.question = question1;
      await gameRepository.save(game);

      const nextQuestion = await repository.getNextAvailableQuestion(game);

      expect(nextQuestion?.id).to.eql(question2.id);
    });

    it('returns the first question that was not already answered', async () => {
      const questionMaster = await createPlayer();
      const winner = await createPlayer();
      const game = await createGame();

      const question1 = await createQuestion({ game });
      const question2 = await createQuestion({ game });
      const question3 = await createQuestion({ game });

      await createTurn({ game, question: question1, questionMaster, winner });

      game.question = question2;
      await game;

      const nextQuestion = await repository.getNextAvailableQuestion(game);

      expect(nextQuestion?.id).to.eql(question3.id);
    });

    it('returns undefined when there is no more question', async () => {
      const questionMaster = await createPlayer();
      const winner = await createPlayer();
      const game = await createGame();

      const question1 = await createQuestion({ game });
      const question2 = await createQuestion({ game });

      await createTurn({ game, question: question1, questionMaster, winner });

      game.question = question2;
      await gameRepository.save(game);

      const nextQuestion = await repository.getNextAvailableQuestion(game);

      expect(nextQuestion).to.be.undefined;
    });
  });
});
