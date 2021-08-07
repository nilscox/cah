import expect from 'expect';

import { createFullPlayer, createGame, createStartedGame } from '../../../../tests/factories';
import { InMemoryStore } from '../../../../tests/InMemoryStore';
import { setGame, setPlayer } from '../../../actions';
import { Game, GameState, PlayState, StartedGame } from '../../../entities/Game';

import { redirect } from './redirect';

describe('redirect', () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();
  });

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
      store.dispatch(setPlayer(createFullPlayer()));
      await expectRedirections('/');
    });
  });

  describe('in game', () => {
    const expectRedirections = async (state: Partial<Game | StartedGame>, expected: string) => {
      for (const before of ['/', '/login', '/game', '/game/coca', '/elsewhere']) {
        const player = createFullPlayer();
        const game = createGame({ ...state, code: 'OK42' });

        store.dispatch(setPlayer(player));
        store.dispatch(setGame(game));

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
