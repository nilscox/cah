import expect from 'expect';

import { gameActions } from '../../../../store/slices/game/game.actions';
import { playerActions } from '../../../../store/slices/player/player.actions';
import { createGame, createPlayer, createStartedGame } from '../../../../tests/factories';
import { TestStore } from '../../../../tests/TestStore';
import { Game, GameState, PlayState, StartedGame } from '../../../entities/game';

import { redirect } from './redirect';

describe('redirect', () => {
  const store = new TestStore();

  describe('not in game', () => {
    const expectRedirections = async (expected: string) => {
      for (const before of ['/', '/login', '/game', '/elsewhere']) {
        store.routerGateway.push(before);

        await store.dispatch(redirect());

        expect(store.routerGateway.pathname).toEqual(expected);
      }
    };

    it('no player => login', async () => {
      await expectRedirections('/login');
    });

    it('player, no game => lobby', async () => {
      store.dispatch(playerActions.setPlayer(createPlayer()));
      await expectRedirections('/');
    });
  });

  describe('in game', () => {
    const expectRedirections = async (state: Partial<Game | StartedGame>, expected: string) => {
      for (const before of ['/', '/login', '/game', '/game/coca', '/elsewhere']) {
        const player = createPlayer();
        const game = createGame({ ...state, code: 'OK42' });

        store.dispatch(playerActions.setPlayer(player));
        store.dispatch(gameActions.setGame(game));

        store.routerGateway.push(before);
        store.routerGateway.pushGame(game, before);

        await store.dispatch(redirect());

        expect(store.routerGateway.pathname).toEqual('/game/OK42');

        if (state.state === GameState.started) {
          expect(store.routerGateway.gamePathname).toEqual('/game/OK42' + expected);
        }
      }
    };

    it('game idle', async () => {
      await expectRedirections({ state: GameState.idle }, '/idle');
    });

    it('game started, players answer', async () => {
      await expectRedirections(createStartedGame({ playState: PlayState.playersAnswer }), '/started/answer-question');
    });

    it('game started, question master selection', async () => {
      await expectRedirections(
        createStartedGame({ playState: PlayState.questionMasterSelection }),
        '/started/winner-selection',
      );
    });

    it('game started, end of turn', async () => {
      await expectRedirections(createStartedGame({ playState: PlayState.endOfTurn }), '/started/end-of-turn');
    });

    it('game finished', async () => {
      await expectRedirections({ state: GameState.finished }, '/finished');
    });
  });
});
