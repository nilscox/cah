import { CardsDealtEvent, Choice } from '@cah/shared';
import { array, getIds } from '@cah/utils';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { assert } from '../../defined';
import { setEntities } from '../../store/set-entities';
import { gameActions } from '../game/game.slice';

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

    unsetPlayer() {
      return null;
    },

    setGameId(state, action: PayloadAction<string>) {
      assert(state);
      state.gameId = action.payload;
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
    builder.addCase(setEntities, (state, action) => {
      const games = Object.values(action.payload.entities.games ?? {});

      if (games.length === 1) {
        assert(state);

        const game = games[0];
        const question = action.payload.entities.questions![game.question];

        state.selectedChoicesIds = array(question.blanks?.length ?? 1, () => null);
      }
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
