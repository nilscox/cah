import { createAnswer, createGamePlayer, createStartedGame, createTurn } from '@cah/shared';

import { TestStore } from '../../test-store';
import { turnsFetched } from '../../use-cases/fetch-turns/fetch-turns';

import { selectWinners } from './turns.selectors';

describe('turns selectors', () => {
  let store: TestStore;

  beforeEach(() => {
    store = new TestStore();

    store.setPlayer();
  });

  describe('selectWinner', () => {
    it('selects the current winners', () => {
      const player1 = createGamePlayer({ id: 'player1' });
      const player2 = createGamePlayer({ id: 'player2' });

      store.setGame(
        createStartedGame({
          players: [player1, player2],
        }),
      );

      store.dispatch(
        turnsFetched([
          createTurn({
            id: 'turn1',
            number: 1,
            answers: [
              createAnswer({ id: 'answer11', playerId: 'player1' }),
              createAnswer({ id: 'answer12', playerId: 'player2' }),
            ],
            selectedAnswerId: 'answer11',
          }),
          createTurn({
            id: 'turn2',
            number: 2,
            answers: [
              createAnswer({ id: 'answer21', playerId: 'player1' }),
              createAnswer({ id: 'answer22', playerId: 'player2' }),
            ],
            selectedAnswerId: 'answer22',
          }),
          createTurn({
            id: 'turn3',
            number: 3,
            answers: [
              createAnswer({ id: 'answer31', playerId: 'player1' }),
              createAnswer({ id: 'answer32', playerId: 'player2' }),
            ],
            selectedAnswerId: 'answer31',
          }),
        ]),
      );

      expect(store.select(selectWinners)).toEqual([player1]);
    });

    it('two tied winners', () => {
      const player1 = createGamePlayer({ id: 'player1' });
      const player2 = createGamePlayer({ id: 'player2' });

      store.setGame(
        createStartedGame({
          players: [player1, player2],
        }),
      );

      store.dispatch(
        turnsFetched([
          createTurn({
            id: 'turn1',
            number: 1,
            answers: [
              createAnswer({ id: 'answer11', playerId: 'player1' }),
              createAnswer({ id: 'answer12', playerId: 'player2' }),
            ],
            selectedAnswerId: 'answer11',
          }),
          createTurn({
            id: 'turn2',
            number: 2,
            answers: [
              createAnswer({ id: 'answer21', playerId: 'player1' }),
              createAnswer({ id: 'answer22', playerId: 'player2' }),
            ],
            selectedAnswerId: 'answer22',
          }),
        ]),
      );

      expect(store.select(selectWinners)).toEqual([player1, player2]);
    });
  });
});
