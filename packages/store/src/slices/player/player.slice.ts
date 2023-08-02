import { CardsDealtEvent } from '@cah/shared';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { assert } from '../../defined';
import { clearAuthentication } from '../../use-cases/clear-authentication/clear-authentication';
import { createGame } from '../../use-cases/create-game/create-game';
import { fetchPlayer } from '../../use-cases/fetch-player/fetch-player';
import { joinGame } from '../../use-cases/join-game/join-game';

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
    setPlayer(state, action: PayloadAction<PlayerSlice>) {
      return action.payload;
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
    builder.addCase(fetchPlayer.fulfilled, (state, action) => {
      if (!action.payload) {
        return;
      }

      const { entities, result: playerId } = action.payload;
      const player = entities.players![playerId];

      return {
        id: player.id,
        nick: player.nick,
        gameId: player.gameId,
        cardsIds: player.cards,
        selectedChoicesIds: [],
      };
    });

    builder.addCase(clearAuthentication.fulfilled, () => {
      return null;
    });

    builder.addCase(joinGame.fulfilled, (state, action) => {
      assert(state);

      state.gameId = action.payload;
    });

    builder.addCase(createGame.fulfilled, (state, action) => {
      assert(state);

      const { entities, result: gameId } = action.payload;
      const game = entities.games![gameId];

      state.gameId = game.id;
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
