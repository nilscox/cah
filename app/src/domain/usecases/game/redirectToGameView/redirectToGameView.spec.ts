import expect from 'expect';

import { createGame } from '../../../../tests/factories';
import { InMemoryStore } from '../../../../tests/InMemoryStore';
import { setGame } from '../../../actions';
import { Game, GameState, PlayState, StartedGame } from '../../../entities/Game';

import { redirectToGameView } from './redirectToGameView';

describe('redirectToGameView', () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();
  });

  const expectRedirections = async (state: Partial<Game | StartedGame>, expected: string) => {
    store.dispatch(setGame(createGame({ ...state, code: 'OK42' })));

    await store.dispatch(redirectToGameView());

    expect(store.gameRouterGateway.pathname).toEqual('/game/OK42' + expected);
  };

  it('idle => /game/:code/idle', async () => {
    await expectRedirections({ state: GameState.idle }, '/idle');
  });

  it('started, players answer => /game/:code/started/players-answer', async () => {
    await expectRedirections(
      { state: GameState.started, playState: PlayState.playersAnswer },
      '/started/players-answer',
    );
  });

  it('started, question master selection => /game/:code/started/question-master-selection', async () => {
    await expectRedirections(
      { state: GameState.started, playState: PlayState.questionMasterSelection },
      '/started/question-master-selection',
    );
  });

  it('started, end of turn => /game/:code/started/end-of-turn', async () => {
    await expectRedirections({ state: GameState.started, playState: PlayState.endOfTurn }, '/started/end-of-turn');
  });

  it('finished => /game/:code/finished', async () => {
    await expectRedirections({ state: GameState.finished }, '/finished');
  });
});
