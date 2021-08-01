import expect from 'expect';

import {
  createAnswer,
  createChoice,
  createChoices,
  createFullPlayer,
  createStartedGame,
} from '../../../../tests/factories';
import { InMemoryStore } from '../../../../tests/InMemoryStore';
import { choiceSelected, setGame, setPlayer } from '../../../actions';
import { Choice } from '../../../entities/Choice';
import { PlayState } from '../../../entities/Game';

import { validateChoicesSelection } from './validateChoicesSelection';

describe('validateChoicesSelection', () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();
  });

  const setup = (cards: Choice[], selected: Choice) =>
    store.setup(({ dispatch, listenRTCMessages }: InMemoryStore) => {
      dispatch(setPlayer(createFullPlayer({ cards })));
      dispatch(setGame(createStartedGame()));
      dispatch(choiceSelected(selected));
      listenRTCMessages();
    });

  it('validates a selection of choices', async () => {
    const choices = createChoices(2, { text: ['youpi'] });

    setup(choices, choices[0]);

    await store.dispatch(validateChoicesSelection());

    expect(store.gameGateway.answered).toEqual([choices[0]]);

    store.expectPartialState('player', {
      selectionValidated: true,
      cards: [choices[1]],
    });

    store.expectPartialState('game', {
      answers: [],
    });
  });

  it('answers as the last player', async () => {
    const choice = createChoice({ text: 'youpi' });
    const answer = createAnswer({ choices: [choice] });

    setup([choice], choice);

    // triggers a AllPlayersAnswered event
    store.gameGateway.answers = [answer];

    await store.dispatch(validateChoicesSelection());

    store.expectPartialState('game', {
      playState: PlayState.questionMasterSelection,
      answers: [answer],
    });
  });
});
