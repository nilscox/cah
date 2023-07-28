import { Player } from '@cah/shared';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { assert } from '../defined';
import { AppState } from '../types';

import { gameActions } from './game.slice';

type PlayerSlice = {
  id: string;
  nick: string;
  gameId?: string;
  cards?: string[];
};

const playerSlice = createSlice({
  name: 'player',
  initialState: null as PlayerSlice | null,
  reducers: {
    setPlayer(_, action: PayloadAction<Player>) {
      return {
        id: action.payload.id,
        gameId: action.payload.gameId,
        nick: action.payload.nick,
        cards: action.payload.cards?.map((card) => card.id),
      };
    },
  },
  extraReducers(builder) {
    builder.addCase(gameActions.setGame, (state, action) => {
      assert(state);
      state.gameId = action.payload.id;
    });
  },
});

export const { actions: playerActions, reducer: playerReducer } = playerSlice;

export const playerSelectors = {
  player: (state: AppState) => state.player,
};
