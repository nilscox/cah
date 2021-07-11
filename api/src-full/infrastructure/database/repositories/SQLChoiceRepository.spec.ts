import { expect } from 'chai';
import { getCustomRepository } from 'typeorm';

import {
  createAnswer,
  createChoice,
  createGame,
  createPlayer,
  createQuestion,
  createTestDatabase,
  createTurn,
} from '../test-utils';

import { SQLChoiceRepository } from './SQLChoiceRepository';

describe('SQLChoiceRepository', () => {
  let repository: SQLChoiceRepository;

  createTestDatabase();

  before(() => {
    repository = getCustomRepository(SQLChoiceRepository);
  });

  describe('getAvailableChoices', () => {
    it('returns all the choices', async () => {
      const game = await createGame();
      const choice = await createChoice({ game });

      const choices = await repository.getAvailableChoices(game);

      expect(choices).to.have.length(1);
      expect(choices[0].id).to.eql(choice.id);
    });

    it("excludes the choices that are in the players's hands", async () => {
      const player = await createPlayer();
      const game = await createGame({ players: [player] });

      const choice = await createChoice({ game });
      await createChoice({ game, player });

      const choices = await repository.getAvailableChoices(game);

      expect(choices).to.have.length(1);
      expect(choices[0].id).to.eql(choice.id);
    });

    it('excludes the choices that are part of an answer for the current turn', async () => {
      const player = await createPlayer();
      const game = await createGame({ players: [player] });

      const choice1 = await createChoice({ game });

      const choice2 = await createChoice({ game });
      await createAnswer({ game, player, choices: [choice2] });

      const choices = await repository.getAvailableChoices(game);

      expect(choices).to.have.length(1);
      expect(choices[0].id).to.eql(choice1.id);
    });

    it('excludes the choices that were part of an answer for a previous turn', async () => {
      const player = await createPlayer();
      const game = await createGame({ players: [player] });
      const question = await createQuestion({ game });

      const choice1 = await createChoice({ game });

      const choice2 = await createChoice({ game });
      const answer = await createAnswer({ player, choices: [choice2] });
      await createTurn({ game, questionMaster: player, question, winner: player, answers: [answer] });

      const choices = await repository.getAvailableChoices(game);

      expect(choices).to.have.length(1);
      expect(choices[0].id).to.eql(choice1.id);
    });

    it('returns an empty array when there is no more choice', async () => {
      const player = await createPlayer();
      const game = await createGame({ players: [player] });
      const question = await createQuestion({ game });

      await createChoice({ game, player });

      const choice2 = await createChoice({ game });
      await createAnswer({ game, player, choices: [choice2] });

      const choice3 = await createChoice({ game });
      const answer = await createAnswer({ player, choices: [choice3] });
      await createTurn({ game, questionMaster: player, question, winner: player, answers: [answer] });

      const choices = await repository.getAvailableChoices(game);

      expect(choices).to.have.length(0);
    });
  });
});
