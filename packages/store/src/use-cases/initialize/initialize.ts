import { FetchError } from '@cah/client/src';
import { Game, GameEvent, Player } from '@cah/shared';

import { Dependencies } from '../../dependencies';
import { gameActions } from '../../slices/game.slice';
import { playerActions } from '../../slices/player.slice';
import { createThunk } from '../../store/create-thunk';
import { AppThunk } from '../../types';

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

export const initialize = createThunk('initialize', async ({ client, dispatch }) => {
  for (const event of events) {
    client.addEventListener(event, dispatch);
  }

  const player = await dispatch(fetchPlayer());

  if (player?.gameId) {
    await dispatch(fetchGame(player.gameId));
  }
});

const fetchPlayer = (): AppThunk<Promise<Player | undefined>> => {
  return async (dispatch, getState, { client }: Dependencies) => {
    try {
      const player = await client.getAuthenticatedPlayer();

      dispatch(playerActions.setPlayer(player));
      client.connect();

      return player;
    } catch (error) {
      if (error instanceof FetchError && error.status === 404) {
        return undefined;
      } else {
        throw error;
      }
    }
  };
};

const fetchGame = (gameId: string): AppThunk<Promise<Game | undefined>> => {
  return async (dispatch, getState, { client }: Dependencies) => {
    const game = await client.getGame(gameId);

    dispatch(gameActions.setGame(game));

    return game;
  };
};
