import expect from 'expect';

import { gameActions } from '../../store/slices/game/game.actions';
import { playerActions } from '../../store/slices/player/player.actions';
import { createPlayer } from '../../tests/factories';
import { TestBuilder } from '../../tests/TestBuilder';

import { selectCanFlushCards, selectIsGameCreator, selectIsQuestionMaster } from './playerSelectors';

describe('playerSelectors', () => {
  describe('selectIsGameCreator', () => {
    const player = createPlayer();
    const store = new TestBuilder().apply(TestBuilder.setPlayer(player)).getStore();

    it('returns true when the player created the game', () => {
      store.dispatch(TestBuilder.createGame({ creator: player.id }));

      expect(store.select(selectIsGameCreator)).toBe(true);
    });

    it('returns false when the player did not create the game', () => {
      store.dispatch(TestBuilder.createGame());

      expect(selectIsGameCreator(store.getState())).toBe(false);
    });
  });

  describe('selectIsQuestionMaster', () => {
    const player = createPlayer();
    const store = new TestBuilder()
      .apply(TestBuilder.setPlayer(player))
      .apply(TestBuilder.createGame())
      .apply(TestBuilder.startGame())
      .getStore();

    it('returns true when the player is the current question master', () => {
      store.dispatch(gameActions.updateGame({ questionMaster: player.id }));

      expect(store.select(selectIsQuestionMaster)).toBe(true);
    });

    it('returns false when the player is not the current question master', () => {
      const otherPlayer = createPlayer();

      store.dispatch(gameActions.updateGame({ questionMaster: otherPlayer.id }));

      expect(store.select(selectIsQuestionMaster)).toBe(false);
    });
  });

  describe('selectCanFlushCards', () => {
    const player = createPlayer();
    const store = new TestBuilder()
      .apply(TestBuilder.setPlayer(player))
      .apply(TestBuilder.createGame())
      .apply(TestBuilder.startGame())
      .getStore();

    it('allows the player to flush his cards', () => {
      expect(store.select(selectCanFlushCards)).toBe(true);
    });

    it('prevents the player to flush his cards when the play state is not players answer', () => {
      store.dispatch(TestBuilder.answerQuestion());

      expect(selectCanFlushCards(store.getState())).toBe(false);

      store.dispatch(TestBuilder.selectWinner());

      expect(selectCanFlushCards(store.getState())).toBe(false);
    });

    it('prevents the player to flush his cards when he has validated his selection', () => {
      store.dispatch(playerActions.setSelectionValidated());

      expect(selectCanFlushCards(store.getState())).toBe(false);
    });

    it('prevents the player to flush his cards when he already has', () => {
      store.dispatch(playerActions.setCardsFlushed());

      expect(selectCanFlushCards(store.getState())).toBe(false);
    });
  });
});
