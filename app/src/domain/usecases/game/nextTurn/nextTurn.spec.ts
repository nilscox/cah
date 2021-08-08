import expect from 'expect';

import { GameState } from '../../../../../../shared/enums';
import { selectGame } from '../../../../store/selectors/gameSelectors';
import { createFullPlayer, createPlayer, createQuestion, createStartedGame } from '../../../../tests/factories';
import { InMemoryStore } from '../../../../tests/InMemoryStore';
import { selectionValidated, setGame, setPlayer } from '../../../actions';
import { PlayState } from '../../../entities/Game';
import { Player } from '../../../entities/Player';

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
      dispatch(selectionValidated());
      dispatch(setGame(createStartedGame({ playState: PlayState.endOfTurn, players: [nextQuestionMaster] })));

      listenRTCMessages();
    });

    const game = selectGame(store.getState());
    const winner = game.winner as Player;
    const question = game.question;

    await store.dispatch(nextTurn());

    expect(store.gameGateway.turnEnded).toBe(true);

    store.expectPartialState('game', {
      playState: PlayState.playersAnswer,
      questionMaster: nextQuestionMaster,
      question: nextQuestion,
      answers: [],
      winner: undefined,
      turns: [
        {
          number: 1,
          answers: [],
          question,
          winner,
        },
      ],
    });

    store.expectPartialState('player', {
      selectionValidated: false,
    });
  });

  it('ends the game', async () => {
    store.setup(({ dispatch, listenRTCMessages }) => {
      dispatch(setPlayer(createFullPlayer()));
      dispatch(setGame(createStartedGame({ playState: PlayState.endOfTurn })));

      listenRTCMessages();
    });

    const game = selectGame(store.getState());
    const winner = game.winner as Player;
    const question = game.question;

    await store.dispatch(nextTurn());

    store.expectPartialState('game', {
      state: GameState.finished,
      playState: undefined,
      questionMaster: undefined,
      question: undefined,
      answers: undefined,
      turns: [
        {
          number: 1,
          answers: [],
          question,
          winner,
        },
      ],
    });
  });
});
