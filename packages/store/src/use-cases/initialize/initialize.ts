import { GameEvent } from '@cah/shared';

import { selectHasPlayer, selectPlayer } from '../../slices/player/player.selectors';
import { createThunk } from '../../store/create-thunk';
import { fetchGame } from '../fetch-game/fetch-game';
import { fetchPlayer } from '../fetch-player/fetch-player';

const events: Array<GameEvent['type']> = [
  'player-connected',
  'player-disconnected',
  'game-created',
  'player-joined',
  'player-left',
  'game-started',
  'turn-started',
  'cards-dealt',
  'player-answered',
  'all-players-answered',
  'winning-answer-selected',
  'turn-ended',
  'game-ended',
];

export const initialize = createThunk(async ({ client, dispatch, getState }) => {
  for (const event of events) {
    client.addEventListener(event, dispatch);
  }

  await dispatch(fetchPlayer());

  if (selectHasPlayer(getState())) {
    const { gameId } = selectPlayer(getState());

    if (gameId) {
      await dispatch(fetchGame(gameId));
    }
  }
});
