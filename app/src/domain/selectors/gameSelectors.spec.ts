import expect from 'expect';

import { array } from '../../shared/array';
import { arrayToObject } from '../../shared/arrayToObject';
import { gameActions } from '../../store/slices/game/game.actions';
import { createAnonymousAnswer, createAnswer, createGamePlayer, createPlayer } from '../../tests/factories';
import { TestBuilder } from '../../tests/TestBuilder';

import { selectCanStartGame, selectIsLastTurn, selectIsWinningAnswer } from './gameSelectors';

describe('gameSelectors', () => {
  describe('selectCanStartGame', () => {
    const player = createPlayer();
    const players = [player, ...array(2, () => createPlayer())];

    const store = new TestBuilder().apply(TestBuilder.setPlayer(player)).getStore();

    it('allows the player who created the game to start it', () => {
      store.dispatch(TestBuilder.createGame({ players, creator: player.id }));

      expect(store.select(selectCanStartGame)).toEqual(true);
    });

    it('does not allow a player who did not create the game to start it', () => {
      store.dispatch(TestBuilder.createGame({ players }));

      expect(store.select(selectCanStartGame)).toEqual(false);
    });

    it('does not allow to start a game containing less than 3 players', () => {
      store.dispatch(TestBuilder.createGame({ players: players.slice(0, 2), creator: player.id }));

      expect(store.select(selectCanStartGame)).toEqual(false);
    });
  });

  describe('selectIsLastTurn', () => {
    const store = new TestBuilder()
      .apply(TestBuilder.setPlayer())
      .apply(TestBuilder.createGame())
      .apply(TestBuilder.startGame({ turns: 2 }))
      .getStore();

    it('returns true when the current turn is last one of the game', () => {
      store.dispatch(TestBuilder.playTurn());

      expect(store.select(selectIsLastTurn)).toEqual(true);
    });

    it('returns false when the current turn is not the last one of the game', () => {
      expect(store.select(selectIsLastTurn)).toEqual(false);
    });
  });

  describe('selectIsWinningAnswer', () => {
    const players = array(3, () => createGamePlayer());

    const store = new TestBuilder()
      .apply(TestBuilder.setPlayer())
      .apply(TestBuilder.createGame())
      .apply(TestBuilder.startGame())
      .getStore();

    it("returns true when an answer in the winner's answer", () => {
      const [winner] = players;
      const answer = createAnswer({ player: winner.id });

      store.dispatch(
        gameActions.updateGame({
          players: arrayToObject(players),
          winner: winner.id,
          answers: [answer],
        }),
      );

      expect(store.select(selectIsWinningAnswer)(answer)).toEqual(true);
    });

    it('returns false when the answer is anonymous', () => {
      const answer = createAnonymousAnswer();

      store.dispatch(
        gameActions.updateGame({
          players: arrayToObject(players),
          answers: [answer],
        }),
      );

      expect(store.select(selectIsWinningAnswer)(answer)).toEqual(false);
    });

    it("returns false when an answer in not the winner's answer", () => {
      const [winner, notWinner] = players;
      const answer = createAnswer({ player: notWinner.id });

      store.dispatch(
        gameActions.updateGame({
          players: arrayToObject(players),
          winner: winner.id,
          answers: [answer],
        }),
      );

      expect(store.select(selectIsWinningAnswer)(answer)).toEqual(false);
    });
  });
});
