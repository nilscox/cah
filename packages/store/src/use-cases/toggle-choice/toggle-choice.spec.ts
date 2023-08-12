import { Choice, createChoice, createQuestion, createStartedGame } from '@cah/shared';
import { array } from '@cah/utils';

import { selectedSelectedChoices } from '../../slices/player/player.selectors';
import { playerActions } from '../../slices/player/player.slice';
import { TestStore } from '../../test-store';

import { toggleChoice } from './toggle-choice';

describe('toggleChoice', () => {
  let store: TestStore;
  let cards: Choice[];

  beforeEach(() => {
    store = new TestStore();

    cards = array(3, () => createChoice());

    store.setPlayer({ cards: [] });
    store.setGame(createStartedGame({ question: createQuestion({ blanks: [0, 1] }) }));

    store.dispatch(playerActions.addCards(cards));
  });

  it('selects a card', () => {
    store.dispatch(toggleChoice(cards[0]));

    expect(store.select(selectedSelectedChoices)).toEqual([cards[0], null]);
  });

  it('unselects a card', () => {
    store.dispatch(playerActions.setSelectedChoice([cards[0].id, 0]));
    store.dispatch(playerActions.setSelectedChoice([cards[1].id, 1]));

    store.dispatch(toggleChoice(cards[0]));

    expect(store.select(selectedSelectedChoices)).toEqual([null, cards[1]]);
  });

  it('replace the last choice', () => {
    store.dispatch(playerActions.setSelectedChoice([cards[0].id, 0]));
    store.dispatch(playerActions.setSelectedChoice([cards[1].id, 1]));

    store.dispatch(toggleChoice(cards[2]));

    expect(store.select(selectedSelectedChoices)).toEqual([cards[0], cards[2]]);
  });
});
