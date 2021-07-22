import { GameState, PlayState } from '../../../interfaces/entities/Game';
import { InMemoryStore } from '../../../store/utils';
import { createGame, createPlayer, createQuestion } from '../../../utils/factories';
import { setGame } from '../../actions';

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
});
