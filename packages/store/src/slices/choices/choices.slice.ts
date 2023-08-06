import { AllPlayerAnsweredEvent, CardsDealtEvent } from '@cah/shared';
import { PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { setEntities } from '../../store/set-entities';
import { playerActions } from '../player/player.slice';

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
    builder.addCase(setEntities, (state, action) => {
      const choices = Object.values(action.payload.entities.choices ?? {});

      choicesAdapter.addMany(state, choices);
    });

    builder.addCase(playerActions.addCards, (state, action) => {
      choicesAdapter.addMany(state, action.payload);
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
