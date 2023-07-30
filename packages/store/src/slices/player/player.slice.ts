import { CardsDealtEvent, Player } from '@cah/shared';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { assert } from '../../defined';
import { gameActions } from '../game/game.slice';

export type PlayerSlice = {
  id: string;
  nick: string;
  gameId?: string;
  cardsIds?: string[];
  selectedChoicesIds: string[];
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
        cardsIds: action.payload.cards?.map((card) => card.id),
        selectedChoicesIds: [],
      };
    },

    unsetPlayer() {
      return null;
    },

    toggleChoice(state, action: PayloadAction<string>) {
      assert(state);

      const choiceId = action.payload;
      const index = state.selectedChoicesIds.indexOf(choiceId);

      if (index < 0) {
        state.selectedChoicesIds.push(choiceId);
      } else {
        state.selectedChoicesIds.splice(index, 1);
      }
    },

    removeCards(state, action: PayloadAction<string[]>) {
      assert(state);
      assert(state.cardsIds);

      for (const choiceId of action.payload) {
        removeArrayElement(state.cardsIds, choiceId);
        removeArrayElement(state.selectedChoicesIds, choiceId);
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(gameActions.setGame, (state, action) => {
      assert(state);
      state.gameId = action.payload.id;
    });

    builder.addCase('cards-dealt', (state, event: CardsDealtEvent) => {
      assert(state);
      state.cardsIds ??= [];
      state.cardsIds.push(...event.cards.map((choice) => choice.id));
    });
  },
});

export const playerActions = playerSlice.actions;

const removeArrayElement = <T>(array: T[], item: T) => {
  const index = array.indexOf(item);

  if (index >= 0) {
    array.splice(index, 1);
  }
};
