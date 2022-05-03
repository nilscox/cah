import expect from 'expect';

import { array } from '../../shared/array';
import { first } from '../../shared/first';
import { createGamePlayer, createPlayer } from '../../tests/factories';
import { TestBuilder } from '../../tests/TestBuilder';

import { selectBestScore, selectGameWinners, selectScores, selectScoresExcludingWinners } from './scoresSelectors';

describe('scoresSelectors', () => {
  const players = array(3, () => createGamePlayer());

  const store = new TestBuilder()
    .apply(TestBuilder.setPlayer(createPlayer(first(players))))
    .apply(TestBuilder.createGame({ players }))
    .apply(TestBuilder.startGame())
    .getStore();

  describe('selectScores', () => {
    it('selects empty scores when the game has no turns', () => {
      expect(store.select(selectScores)).toEqual(players.map((player) => [player, 0]));
    });

    it("selects the game's scores with a single winner", () => {
      const [winner, notWinner1, notWinner2] = players;

      store.dispatch(TestBuilder.playTurn(winner));
      store.dispatch(TestBuilder.playTurn(notWinner1));
      store.dispatch(TestBuilder.playTurn(winner));
      store.dispatch(TestBuilder.playTurn(notWinner2));

      expect(store.select(selectScores)).toEqual([
        [winner, 2],
        [notWinner1, 1],
        [notWinner2, 1],
      ]);
    });

    it("selects the game's scores with multiple winners", () => {
      const [winner1, winner2, notWinner] = players;

      store.dispatch(TestBuilder.playTurn(winner1));
      store.dispatch(TestBuilder.playTurn(winner2));

      expect(store.select(selectScores)).toEqual([
        [winner1, 1],
        [winner2, 1],
        [notWinner, 0],
      ]);
    });
  });

  describe('selectBestScore', () => {
    it('returns null when the game has no turns', () => {
      expect(store.select(selectBestScore)).toEqual(null);
    });

    it("selects the game's current best score", () => {
      const [winner1, winner2] = players;

      store.dispatch(TestBuilder.playTurn(winner1));

      expect(store.select(selectBestScore)).toEqual(1);

      store.dispatch(TestBuilder.playTurn(winner2));

      expect(store.select(selectBestScore)).toEqual(1);
    });
  });

  describe('selectGameWinners', () => {
    it('selects no one when the game has no turns', () => {
      expect(store.select(selectGameWinners)).toEqual(null);
    });

    it("selects the game's current winner", () => {
      const [winner] = players;

      store.dispatch(TestBuilder.playTurn(winner));

      expect(store.select(selectGameWinners)).toEqual([winner]);
    });

    it('selects multiple tied winners', () => {
      const [winner1, winner2] = players;

      store.dispatch(TestBuilder.playTurn(winner1));
      store.dispatch(TestBuilder.playTurn(winner2));

      expect(store.select(selectGameWinners)).toEqual([winner1, winner2]);
    });
  });

  describe('selectScoresExcludingWinners', () => {
    it('selects all the players when the game has no turns', () => {
      expect(store.select(selectScoresExcludingWinners)).toEqual(null);
    });

    it("selects the scores excluding the game's winners", () => {
      const [winner, notWinner1, notWinner2] = players;

      store.dispatch(TestBuilder.playTurn(winner));

      expect(store.select(selectScoresExcludingWinners)).toEqual([
        [notWinner1, 0],
        [notWinner2, 0],
      ]);
    });

    it("selects the scores excluding the game's tied winners", () => {
      const [winner1, winner2, notWinner] = players;

      store.dispatch(TestBuilder.playTurn(winner1));
      store.dispatch(TestBuilder.playTurn(winner2));

      expect(store.select(selectScoresExcludingWinners)).toEqual([[notWinner, 0]]);
    });
  });
});
