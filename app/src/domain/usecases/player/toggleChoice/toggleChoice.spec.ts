import { PlayState } from '../../../../../../shared/enums';
import {
  createChoice,
  createFullPlayer,
  createGame,
  createQuestion,
  createStartedGame,
} from '../../../../tests/factories';
import { InMemoryStore } from '../../../../tests/InMemoryStore';
import { setGame, setPlayer } from '../../../actions';
import { Choice } from '../../../entities/Choice';
import { Question } from '../../../entities/Question';

import { toggleChoice } from './toggleChoice';

describe('toggleChoice', () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();

    store.setup(({ dispatch, listenRTCMessages }) => {
      dispatch(setPlayer(createFullPlayer()));
      dispatch(setGame(createGame()));
      listenRTCMessages();
    });
  });

  const dealCards = (cards: Choice[]) => {
    store.rtcGateway.triggerMessage({ type: 'CardsDealt', cards: cards });
    store.snapshot();
  };

  const setQuestion = (question: Question) => {
    store.dispatch(setGame(createStartedGame({ question })));
    store.snapshot();
  };

  it('recieves some choices', () => {
    const choice = createChoice({ text: 'youpi' });

    store.rtcGateway.triggerMessage({ type: 'CardsDealt', cards: [choice] });

    store.expectPartialState('player', {
      cards: [choice],
    });
  });

  it('resets the selection when a turn starts', () => {
    const question = createQuestion({ numberOfBlanks: 2 });

    store.rtcGateway.triggerMessage({
      type: 'TurnStarted',
      playState: PlayState.playersAnswer,
      question,
      questionMaster: 'questionMaster',
    });

    store.expectPartialState('player', {
      selection: [null, null],
    });
  });

  it("toggles a choice's selected state", async () => {
    const choice = createChoice({ text: 'youpla' });

    dealCards([choice]);
    setQuestion(createQuestion());

    store.expectPartialState('player', {
      selection: [null],
    });

    store.dispatch(toggleChoice(choice));

    store.expectPartialState('player', {
      selection: [choice],
    });

    store.dispatch(toggleChoice(choice));

    store.expectPartialState('player', {
      selection: [null],
    });
  });

  it('replaces the selected choice with another', async () => {
    const choice1 = createChoice({ text: 'choice 1' });
    const choice2 = createChoice({ text: 'choice 2' });

    dealCards([choice1, choice2]);
    setQuestion(createQuestion({ numberOfBlanks: 1 }));

    store.dispatch(toggleChoice(choice1));
    store.dispatch(toggleChoice(choice2));

    store.expectPartialState('player', {
      cards: [choice1, choice2],
      selection: [choice2],
    });
  });

  it('replaces the last selected choice with another', async () => {
    const choice1 = createChoice({ text: 'choice 1' });
    const choice2 = createChoice({ text: 'choice 2' });
    const choice3 = createChoice({ text: 'choice 3' });

    dealCards([choice1, choice2, choice3]);
    setQuestion(createQuestion({ numberOfBlanks: 2 }));

    store.dispatch(toggleChoice(choice1));
    store.dispatch(toggleChoice(choice2));
    store.dispatch(toggleChoice(choice3));

    store.expectPartialState('player', {
      selection: [choice1, choice3],
    });
  });

  it('replaces the first selected choice with another', async () => {
    const choice1 = createChoice({ text: 'choice 1' });
    const choice2 = createChoice({ text: 'choice 2' });
    const choice3 = createChoice({ text: 'choice 3' });

    dealCards([choice1, choice2, choice3]);
    setQuestion(createQuestion({ numberOfBlanks: 2 }));

    store.dispatch(toggleChoice(choice1));
    store.dispatch(toggleChoice(choice2));
    store.dispatch(toggleChoice(choice1));
    store.dispatch(toggleChoice(choice3));

    store.expectPartialState('player', {
      selection: [choice3, choice2],
    });
  });
});
