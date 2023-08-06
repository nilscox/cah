import { CardsDealtEvent, Choice, GameState } from '@cah/shared';
import { array, getIds } from '@cah/utils';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { assert } from '../../defined';
import { clearAuthentication } from '../../use-cases/clear-authentication/clear-authentication';
import { createGame } from '../../use-cases/create-game/create-game';
import { fetchGame } from '../../use-cases/fetch-game/fetch-game';
import { fetchPlayer } from '../../use-cases/fetch-player/fetch-player';
import { joinGame } from '../../use-cases/join-game/join-game';

export type PlayerSlice = {
  id: string;
  nick: string;
  gameId?: string;
  cardsIds?: string[];
  selectedChoicesIds?: Array<string | null>;
};

export const playerSlice = createSlice({
  name: 'player',
  initialState: null as PlayerSlice | null,
  reducers: {
    setPlayer(state, action: PayloadAction<PlayerSlice>) {
      return action.payload;
    },

    setSelectedChoice(state, action: PayloadAction<[choiceId: string, index: number]>) {
      assert(state);
      assert(state.selectedChoicesIds);

      const [choiceId, index] = action.payload;

      state.selectedChoicesIds[index] = choiceId;
    },

    clearSelectedChoice(state, action: PayloadAction<number>) {
      assert(state);
      assert(state.selectedChoicesIds);

      const index = action.payload;

      state.selectedChoicesIds[index] = null;
    },

    removeCards(state, action: PayloadAction<string[]>) {
      assert(state);
      assert(state.cardsIds);

      for (const choiceId of action.payload) {
        removeArrayElement(state.cardsIds, choiceId);
      }
    },

    addCards(state, action: PayloadAction<Choice[]>) {
      assert(state);
      assert(state.cardsIds);

      state.cardsIds.push(...getIds(action.payload));
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
        selectedChoicesIds: player.gameId ? [] : undefined,
      };
    });

    builder.addCase(fetchGame.fulfilled, (state, action) => {
      assert(state);

      const { entities, result: gameId } = action.payload;
      const game = entities.games![gameId];
      const question = entities.questions![game.question];

      if (game.state === GameState.started) {
        state.selectedChoicesIds = array(question.blanks?.length ?? 1, () => null);
      }
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
