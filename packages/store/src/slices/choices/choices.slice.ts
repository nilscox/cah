import { AllPlayerAnsweredEvent, CardsDealtEvent } from '@cah/shared';
import { PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { gameFetched } from '../../use-cases/fetch-game/fetch-game';
import { playerFetched } from '../../use-cases/fetch-player/fetch-player';
import { playerActions } from '../player/player.slice';

export type ChoicesSlice = {
  id: string;
  text: string;
  caseSensitive: boolean;
};

export const choicesAdapter = createEntityAdapter<ChoicesSlice>();

export const choicesSlice = createSlice({
  name: 'choices',
  initialState: choicesAdapter.getInitialState(),
  reducers: {
    add(state, action: PayloadAction<ChoicesSlice>) {
      choicesAdapter.addOne(state, action.payload);
    },
  },
  extraReducers(builder) {
    builder.addCase(gameFetched, (state, { choices }) => {
      choicesAdapter.addMany(state, choices);
    });

    builder.addCase(playerFetched, (state, { choices }) => {
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
