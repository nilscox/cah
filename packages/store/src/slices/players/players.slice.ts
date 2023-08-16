import { PlayerJoinedEvent, PlayerLeftEvent } from '@cah/shared';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { gameFetched } from '../../use-cases/fetch-game/fetch-game';
import { turnsFetched } from '../../use-cases/fetch-turns/fetch-turns';

export type PlayersSlice = {
  id: string;
  nick: string;
};

export const playersAdapter = createEntityAdapter<PlayersSlice>();

export const playersSlice = createSlice({
  name: 'players',
  initialState: playersAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder.addCase(gameFetched, (state, { players }) => {
      playersAdapter.addMany(state, players);
    });

    builder.addCase(turnsFetched, (state, { players }) => {
      playersAdapter.addMany(state, players);
    });

    builder.addCase('player-joined', (state, action: PlayerJoinedEvent) => {
      const { playerId, nick } = action;
      playersAdapter.addOne(state, { id: playerId, nick });
    });

    builder.addCase('player-left', (state, action: PlayerLeftEvent) => {
      const { playerId } = action;
      playersAdapter.removeOne(state, playerId);
    });
  },
});

export const playersActions = playersSlice.actions;
