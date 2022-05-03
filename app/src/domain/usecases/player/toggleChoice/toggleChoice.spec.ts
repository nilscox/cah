import expect from 'expect';

import { PlayState } from '../../../../../../shared/enums';
import { first } from '../../../../shared/first';
import { selectPlayerCards, selectPlayerChoicesSelection } from '../../../../store/slices/player/player.selectors';
import { createQuestion } from '../../../../tests/factories';
import { TestBuilder } from '../../../../tests/TestBuilder';
import { Choice } from '../../../entities/Choice';

import { toggleChoice } from './toggleChoice';

describe('toggleChoice', () => {
  const store = new TestBuilder()
    .apply(TestBuilder.setPlayer())
    .apply(TestBuilder.createGame())
    .apply(TestBuilder.startGame())
    .getStore();

  it.skip('resets the selection when a turn starts', () => {
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
    const choice = first(store.select(selectPlayerCards)) as Choice;

    expect(store.select(selectPlayerChoicesSelection)).toEqual([null]);

    store.dispatch(toggleChoice(choice));

    expect(store.select(selectPlayerChoicesSelection)).toEqual([choice]);

    store.dispatch(toggleChoice(choice));

    expect(store.select(selectPlayerChoicesSelection)).toEqual([null]);
  });

  it('replaces the selected choice with another', async () => {
    const [choice1, choice2] = store.select(selectPlayerCards);
    const question = createQuestion({ numberOfBlanks: 1 });

    store.dispatch(TestBuilder.setQuestion(question));

    store.dispatch(toggleChoice(choice1));
    store.dispatch(toggleChoice(choice2));

    expect(store.select(selectPlayerChoicesSelection)).toEqual([choice2]);
  });

  it('replaces the last selected choice with another', async () => {
    const [choice1, choice2, choice3] = store.select(selectPlayerCards);
    const question = createQuestion({ numberOfBlanks: 2 });

    store.dispatch(TestBuilder.setQuestion(question));

    store.dispatch(toggleChoice(choice1));
    store.dispatch(toggleChoice(choice2));
    store.dispatch(toggleChoice(choice3));

    expect(store.select(selectPlayerChoicesSelection)).toEqual([choice1, choice3]);
  });

  it('replaces the first selected choice with another', async () => {
    const [choice1, choice2, choice3] = store.select(selectPlayerCards);
    const question = createQuestion({ numberOfBlanks: 2 });

    store.dispatch(TestBuilder.setQuestion(question));

    store.dispatch(toggleChoice(choice1));
    store.dispatch(toggleChoice(choice2));
    store.dispatch(toggleChoice(choice1));
    store.dispatch(toggleChoice(choice3));

    expect(store.select(selectPlayerChoicesSelection)).toEqual([choice3, choice2]);
  });
});
