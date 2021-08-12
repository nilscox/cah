import { PlayState } from '../../../../../../shared/enums';
import {
  createChoice,
  createChoices,
  createFullPlayer,
  createGame,
  createQuestion,
  createStartedGame,
} from '../../../../tests/factories';
import { InMemoryStore } from '../../../../tests/InMemoryStore';
import { setGame, setPlayer } from '../../../actions';
import { Choice } from '../../../entities/Choice';
import { Question } from '../../../entities/Question';
import { setCards } from '../setCards/setCards';

import { toggleChoice } from './toggleChoice';

describe('toggleChoice', () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();

    store.setup(({ dispatch }) => {
      dispatch(setPlayer(createFullPlayer()));
      dispatch(setGame(createGame()));
    });
  });

  const dealCards = (cards: Choice[]) => {
    store.dispatch(setCards(cards));
  };

  const setQuestion = (question: Question) => {
    store.dispatch(setGame(createStartedGame({ question })));
  };

  it('resets the selection when a turn starts', () => {
    const question = createQuestion({ numberOfBlanks: 2 });

    store.listenRTCMessages();

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
    const [choice1, choice2] = createChoices(2);

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
    const [choice1, choice2, choice3] = createChoices(3);

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
    const [choice1, choice2, choice3] = createChoices(3);

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
