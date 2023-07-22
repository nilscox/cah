import { eq } from 'drizzle-orm';

import { Game, GameState, createGame } from 'src/entities';

import { SqlGame, games } from '../../drizzle-schema';
import { EntityNotFoundError } from '../../entity-not-found-error';
import { TestRepository } from '../../test-repository';

import { SqlGameRepository } from './sql-game.repository';

describe('SqlGameRepository', () => {
  let test: TestRepository;
  let repository: SqlGameRepository;

  beforeEach(async () => {
    test = await TestRepository.create();
    repository = test.getRepository(SqlGameRepository);
  });

  describe('find', () => {
    let expected: Game;

    beforeEach(async () => {
      await test.create.game({ id: 'gameId', code: 'ABCD', state: 'idle' });

      expected = createGame({
        id: 'gameId',
        code: 'ABCD',
        state: GameState.idle,
      });
    });

    it('finds a game from its id', async () => {
      await expect(repository.findById('gameId')).resolves.toEqual(expected);
    });

    it('throws a EntityNotFoundError when the given id does not exist', async () => {
      await expect(repository.findById('nope')).rejects.toEqual(
        new EntityNotFoundError('Game', { id: 'nope' })
      );
    });

    it('finds a game from its code', async () => {
      await expect(repository.findByCode('ABCD')).resolves.toEqual(expected);
    });

    it('throws a EntityNotFoundError when the given code does not exist', async () => {
      await expect(repository.findByCode('nope')).rejects.toEqual(
        new EntityNotFoundError('Game', { code: 'nope' })
      );
    });
  });

  describe('insert', () => {
    it('inserts a new game', async () => {
      const game = createGame({
        id: 'gameId',
        code: 'ABCD',
        state: GameState.idle,
      });

      await expect(repository.insert(game)).resolves.toBeUndefined();

      expect(await test.db.select().from(games).where(eq(games.id, 'gameId'))).toEqual<SqlGame[]>([
        {
          id: 'gameId',
          code: 'ABCD',
          state: 'idle',
          questionMasterId: null,
          questionId: null,
          selectedAnswerId: null,
        },
      ]);
    });
  });

  describe('update', () => {
    it('updates an existing game', async () => {
      await test.create.game({ id: 'gameId', code: 'ABCD', state: 'idle' });

      const game = createGame({
        id: 'gameId',
        code: 'CAFE',
        state: GameState.idle,
      });

      await expect(repository.update(game)).resolves.toBeUndefined();

      expect(await test.db.select().from(games).where(eq(games.id, 'gameId'))).toEqual<SqlGame[]>([
        {
          id: 'gameId',
          code: 'CAFE',
          state: 'idle',
          questionMasterId: null,
          questionId: null,
          selectedAnswerId: null,
        },
      ]);
    });
  });
});
