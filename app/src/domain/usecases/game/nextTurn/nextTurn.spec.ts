import expect from 'expect';

import { GameState } from '../../../../../../shared/enums';
import { createFullPlayer, createPlayer, createQuestion, createStartedGame } from '../../../../tests/factories';
import { InMemoryStore } from '../../../../tests/InMemoryStore';
import { setGame, setPlayer } from '../../../actions';
import { PlayState } from '../../../entities/Game';

import { nextTurn } from './nextTurn';

describe('nextTurn', () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();
  });

  it('ends the current turn', async () => {
    const nextQuestionMaster = createPlayer();
    const nextQuestion = createQuestion();

    store.gameGateway.nextQuestionMaster = nextQuestionMaster;
    store.gameGateway.nextQuestion = nextQuestion;

    store.setup(({ dispatch, listenRTCMessages }) => {
      dispatch(setPlayer(createFullPlayer()));
      dispatch(setGame(createStartedGame({ playState: PlayState.endOfTurn, players: [nextQuestionMaster] })));

      listenRTCMessages();
    });

    await store.dispatch(nextTurn());

    expect(store.gameGateway.turnEnded).toBe(true);

    store.expectPartialState('game', {
      playState: PlayState.playersAnswer,
      questionMaster: nextQuestionMaster,
      question: nextQuestion,
      answers: [],
      winner: undefined,
    });
  });

  it('ends the game', async () => {
    store.setup(({ dispatch, listenRTCMessages }) => {
      dispatch(setPlayer(createFullPlayer()));
      dispatch(setGame(createStartedGame({ playState: PlayState.endOfTurn })));

      listenRTCMessages();
    });

    await store.dispatch(nextTurn());

    store.expectPartialState('game', {
      state: GameState.finished,
      playState: undefined,
      questionMaster: undefined,
      question: undefined,
      answers: undefined,
    });
  });
});
