import { PlayerJoinedEvent, PlayerLeftEvent } from '@cah/shared';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { AppState } from '../types';

import { gameActions } from './game.slice';

type PlayersSlice = {
  id: string;
  nick: string;
};

const playersAdapter = createEntityAdapter<PlayersSlice>();

const playersSlice = createSlice({
  name: 'players',
  initialState: playersAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder.addCase(gameActions.setGame, (state, action) => {
      playersAdapter.addMany(state, action.payload.players);
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

export const { actions: playersActions, reducer: playersReducer } = playersSlice;

const selectors = playersAdapter.getSelectors((state: AppState) => state.players);

export const playersSelectors = {
  all: selectors.selectAll,
};
