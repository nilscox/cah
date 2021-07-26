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
      for (const before of ['/', '/login', '/game', '/elsewhere']) {
        store.routerGateway.push(before);
        store.gameRouterGateway.push(before);

        store.dispatch(setPlayer(createFullPlayer()));
        store.dispatch(setGame(createGame({ ...state, code: 'OK42' })));

        await store.dispatch(redirect());

        expect(store.routerGateway.pathname).toEqual('/game/OK42/' + state.state);

        if (state.state === GameState.started) {
          expect(store.gameRouterGateway.pathname).toEqual('/game/OK42' + expected);
        }
      }
    };

    it('game idle', async () => {
      await expectRedirections({ state: GameState.idle }, '/idle');
    });

    it('game started, players answer', async () => {
      await expectRedirections(createStartedGame({ playState: PlayState.playersAnswer }), '/started/players-answer');
    });

    it('game started, question master selection', async () => {
      await expectRedirections(
        createStartedGame({ playState: PlayState.questionMasterSelection }),
        '/started/question-master-selection',
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
