import {
  Answer,
  Choice,
  GameState,
  createAnswer,
  createChoice,
  createCurrentPlayer,
  createStartedGame,
  createTurn,
} from '@cah/shared';

import { answersActions } from '../../slices/answers/answers.slice';
import { gameActions } from '../../slices/game/game.slice';
import {
  selectHasSubmittedAnswer,
  selectPlayerCards,
  selectedSelectedChoices,
} from '../../slices/player/player.selectors';
import { selectTurns } from '../../slices/turns/turns.selectors';
import { TestStore } from '../../test-store';

import { endTurn } from './end-turn';

describe('endTurn', () => {
  let store: TestStore;

  let cards: Choice[];
  let submittedChoices: Choice[];
  let submittedAnswer: Answer;

  beforeEach(() => {
    store = new TestStore();

    cards = [createChoice()];
    submittedChoices = [createChoice()];
    submittedAnswer = createAnswer({ choices: submittedChoices });

    store.setPlayer(createCurrentPlayer({ cards, submittedAnswer }));
    store.setGame(createStartedGame());
  });

  it('ends the current turn', async () => {
    await store.dispatch(endTurn());

    expect(store.client.endTurn).toHaveBeenCalledWith();
  });

  it('handles a turn-ended event', () => {
    const turn = createTurn();

    store.dispatch(answersActions.add({ id: 'answerId', choices: [] }));
    store.dispatch(gameActions.setSelectedAnswerId('answerId'));

    store.dispatchEvent({
      type: 'turn-ended',
      turn,
    });

    const game = store.getGame();

    expect(game).toHaveProperty('answersIds', []);
    expect(game).not.toHaveProperty('selectedAnswerId');

    expect(store.select(selectPlayerCards)).toEqual(cards);
    expect(store.select(selectedSelectedChoices)).toEqual([]);
    expect(store.select(selectHasSubmittedAnswer)).toEqual(false);

    expect(store.select(selectTurns)).toHaveLength(1);
  });

  it('handles a game-ended event', () => {
    store.dispatchEvent({
      type: 'game-ended',
    });

    const game = store.getGame();

    expect(game).toHaveProperty('state', GameState.finished);
    expect(game).not.toHaveProperty('questionMasterId');
    expect(game).not.toHaveProperty('questionId');
    expect(game).not.toHaveProperty('answersIds');
    expect(game).not.toHaveProperty('selectedAnswerId');
  });
});
