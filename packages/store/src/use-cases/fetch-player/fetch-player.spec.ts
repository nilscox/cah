import { FetchError } from '@cah/client';
import { createAnswer, createChoice } from '@cah/shared';

import { selectAllAnswers } from '../../slices/answers/answers.selectors';
import { AnswerSlice } from '../../slices/answers/answers.slice';
import { selectAllChoices } from '../../slices/choices/choices.selectors';
import { ChoicesSlice } from '../../slices/choices/choices.slice';
import { selectHasPlayer } from '../../slices/player/player.selectors';
import { PlayerSlice } from '../../slices/player/player.slice';
import { TestStore } from '../../test-store';

import { fetchPlayer } from './fetch-player';

describe('fetchPlayer', () => {
  let store: TestStore;

  beforeEach(() => {
    store = new TestStore();
  });

  it('fetches the authenticated player', async () => {
    const card = createChoice({ id: 'choiceId' });

    store.client.getAuthenticatedPlayer.mockResolvedValue({
      id: 'playerId',
      nick: 'nick',
      gameId: 'gameId',
      cards: [card],
    });

    await store.dispatch(fetchPlayer());

    expect(store.getPlayer()).toEqual<PlayerSlice>({
      id: 'playerId',
      nick: 'nick',
      gameId: 'gameId',
      cardsIds: ['choiceId'],
      selectedChoicesIds: undefined,
      answerSubmitted: false,
    });

    expect(store.select(selectAllChoices)).toEqual<ChoicesSlice[]>([card]);
  });

  it('with a submitted answer', async () => {
    const card = createChoice({ id: 'choiceId' });
    const submittedChoice = createChoice({ id: 'submittedChoiceId' });

    const submittedAnswer = createAnswer({
      choices: [submittedChoice],
    });

    store.client.getAuthenticatedPlayer.mockResolvedValue({
      id: 'playerId',
      nick: 'nick',
      gameId: 'gameId',
      cards: [card],
      submittedAnswer,
    });

    await store.dispatch(fetchPlayer());

    expect(store.getPlayer()).toEqual<PlayerSlice>({
      id: 'playerId',
      nick: 'nick',
      gameId: 'gameId',
      cardsIds: ['submittedChoiceId', 'choiceId'],
      selectedChoicesIds: ['submittedChoiceId'],
      answerSubmitted: true,
    });

    expect(store.select(selectAllChoices)).toEqual<ChoicesSlice[]>([card, submittedChoice]);
    expect(store.select(selectAllAnswers)).toHaveLength(1);
  });

  it('does not fail when the player is not authenticated', async () => {
    store.client.getAuthenticatedPlayer.mockRejectedValue(new FetchError(401, ''));

    await store.dispatch(fetchPlayer());

    expect(store.select(selectHasPlayer)).toBe(false);
  });
});
