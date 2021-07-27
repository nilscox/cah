import expect from 'expect';

import { createAnswer, createChoice, createFullPlayer, createStartedGame } from '../../../../tests/factories';
import { InMemoryStore } from '../../../../tests/InMemoryStore';
import { choiceSelected, setGame, setPlayer } from '../../../actions';
import { PlayState } from '../../../entities/Game';

import { validateChoicesSelection } from './validateChoicesSelection';

describe('validateChoicesSelection', () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();

    store.setup(({ dispatch, listenRTCMessages }) => {
      dispatch(setPlayer(createFullPlayer()));
      dispatch(setGame(createStartedGame()));
      listenRTCMessages();
    });
  });

  it('validates a selection of choices', async () => {
    const choice = createChoice({ text: 'youpi' });

    store.dispatch(choiceSelected(choice));
    store.snapshot();

    await store.dispatch(validateChoicesSelection());

    expect(store.gameGateway.answered).toEqual([choice]);

    store.expectPartialState('player', {
      selectionValidated: true,
    });

    store.expectPartialState('game', {
      answers: [],
    });
  });

  it('answers as the last player', async () => {
    const choice = createChoice({ text: 'youpi' });
    const answer = createAnswer({ choices: [choice] });

    store.dispatch(choiceSelected(choice));
    store.snapshot();

    // triggers a AllPlayersAnswered event
    store.gameGateway.answers = [answer];

    await store.dispatch(validateChoicesSelection());

    store.expectPartialState('game', {
      playState: PlayState.questionMasterSelection,
      answers: [answer],
    });
  });
});
