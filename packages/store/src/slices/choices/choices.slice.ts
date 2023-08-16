import { AllPlayerAnsweredEvent, CardsDealtEvent } from '@cah/shared';
import { PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { NormalizedChoice } from '../../normalization';
import { gameFetched } from '../../use-cases/fetch-game/fetch-game';
import { playerFetched } from '../../use-cases/fetch-player/fetch-player';
import { turnsFetched } from '../../use-cases/fetch-turns/fetch-turns';
import { playerActions } from '../player/player.slice';

export const choicesAdapter = createEntityAdapter<NormalizedChoice>();

export const choicesSlice = createSlice({
  name: 'choices',
  initialState: choicesAdapter.getInitialState(),
  reducers: {
    add(state, action: PayloadAction<NormalizedChoice>) {
      choicesAdapter.addOne(state, action.payload);
    },
  },
  extraReducers(builder) {
    builder.addCase(gameFetched, (state, { choices }) => {
      choicesAdapter.addMany(state, choices);
    });

    builder.addCase(turnsFetched, (state, { choices }) => {
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
