import expect from 'expect';

import { createGame, createPlayer, createQuestion } from '../../../../tests/factories';
import { InMemoryStore } from '../../../../tests/InMemoryStore';
import { setGame } from '../../../actions';
import { GameState, PlayState } from '../../../entities/Game';

import { startGame } from './startGame';

describe('startGame', () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();
  });

  it('starts a game', async () => {
    const player = createPlayer({ nick: 'wat' });

    store.dispatch(setGame(createGame({ players: [player] })));

    store.listenRTCMessages();
    store.snapshot();

    await store.dispatch(startGame(player, 3));

    store.expectPartialState('game', {
      state: GameState.started,
      playState: PlayState.playersAnswer,
      questionMaster: player,
      question: createQuestion(),
    });
  });

  it('redirects to the started game view', async () => {
    const player = createPlayer({ nick: 'wat' });

    store.dispatch(setGame(createGame({ code: '1234' })));

    await store.dispatch(startGame(player, 3));

    expect(store.routerGateway.gamePathname).toEqual('/game/1234/started');
  });
});
