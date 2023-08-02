import { AllPlayerAnsweredEvent, CardsDealtEvent } from '@cah/shared';
import { PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { fetchGame } from '../../use-cases/fetch-game/fetch-game';
import { fetchPlayer } from '../../use-cases/fetch-player/fetch-player';

export type ChoiceSlice = {
  id: string;
  text: string;
  caseSensitive: boolean;
};

export const choicesAdapter = createEntityAdapter<ChoiceSlice>();

export const choicesSlice = createSlice({
  name: 'choices',
  initialState: choicesAdapter.getInitialState(),
  reducers: {
    add(state, action: PayloadAction<ChoiceSlice>) {
      choicesAdapter.addOne(state, action.payload);
    },

    addMany(state, action: PayloadAction<ChoiceSlice[]>) {
      choicesAdapter.addMany(state, action.payload);
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchPlayer.fulfilled, (state, action) => {
      if (!action.payload) {
        return;
      }

      const { entities } = action.payload;
      const choices = Object.values(entities.choices ?? []);

      choicesAdapter.addMany(state, choices);
    });

    builder.addCase(fetchGame.fulfilled, (state, action) => {
      const { entities } = action.payload;
      const choices = Object.values(entities.choices ?? []);

      choicesAdapter.addMany(state, choices);
    });

    builder.addCase('cards-dealt', (state, event: CardsDealtEvent) => {
      choicesAdapter.addMany(state, event.cards);
    });

    builder.addCase('all-players-answered', (state, event: AllPlayerAnsweredEvent) => {
      choicesAdapter.addMany(
        state,
        event.answers.flatMap(({ choices }) => choices),
      );
    });
  },
});

export const choicesActions = choicesSlice.actions;
