import { FetchError } from '@cah/client';
import { createChoice } from '@cah/shared';

import { selectAllChoices } from '../../slices/choices/choices.selectors';
import { ChoiceSlice } from '../../slices/choices/choices.slice';
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
      selectedChoicesIds: [],
    });

    expect(store.select(selectAllChoices)).toEqual<ChoiceSlice[]>([card]);
  });

  it('does not fail when the player is not authenticated', async () => {
    store.client.getAuthenticatedPlayer.mockRejectedValue(new FetchError(401, ''));

    await store.dispatch(fetchPlayer());

    expect(store.select(selectHasPlayer)).toBe(false);
  });
});
