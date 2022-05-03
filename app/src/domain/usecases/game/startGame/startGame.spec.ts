import expect from 'expect';

import { createGame, createPlayer, createQuestion } from '../../../../tests/factories';
import { InMemoryStore } from '../../../../tests/InMemoryStore';
import { setGame } from '../../../actions';
import { GameState, PlayState } from '../../../entities/game';

import { startGame } from './startGame';

describe('startGame', () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();
  });

  it('starts a game', async () => {
    const player = createPlayer({ nick: 'wat' });
    const game = createGame({ players: [player] });
    const question = createQuestion();

    store.dispatch(setGame(game));
    store.listenRTCMessages();

    store.gameGateway.firstQuestion = question;

    await store.dispatch(startGame(player, 3));

    store.expectPartialState('game', {
      state: GameState.started,
      playState: PlayState.playersAnswer,
      questionMaster: player,
      question,
      totalQuestions: 3,
    });
  });

  it('redirects to the started game view', async () => {
    const player = createPlayer({ nick: 'wat' });

    store.dispatch(setGame(createGame({ code: '1234' })));
    store.listenRTCMessages();

    store.gameGateway.firstQuestion = createQuestion();

    await store.dispatch(startGame(player, 3));

    expect(store.routerGateway.gamePathname).toEqual('/game/1234/started/answer-question');
  });
});
