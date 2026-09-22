import { type AllPlayerAnsweredEvent, type CardsDealtEvent } from '@cah/shared';
import { type PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { type NormalizedChoice } from '../../normalization.ts';
import { gameFetched } from '../../use-cases/fetch-game/fetch-game.ts';
import { playerFetched } from '../../use-cases/fetch-player/fetch-player.ts';
import { turnsFetched } from '../../use-cases/fetch-turns/fetch-turns.ts';
import { playerActions } from '../player/player.slice.ts';

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
