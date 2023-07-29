import { CardsDealtEvent, Player } from '@cah/shared';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { assert } from '../../defined';
import { gameActions } from '../game/game.slice';

type PlayerSlice = {
  id: string;
  nick: string;
  gameId?: string;
  cards?: string[];
};

export const playerSlice = createSlice({
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

    builder.addCase('cards-dealt', (state, event: CardsDealtEvent) => {
      assert(state);
      state.cards ??= [];
      state.cards.push(...event.cards.map((choice) => choice.id));
    });
  },
});

export const playerActions = playerSlice.actions;
