import { CardsDealtEvent, Choice } from '@cah/shared';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

export const choicesAdapter = createEntityAdapter<Choice>();

export const choicesSlice = createSlice({
  name: 'choices',
  initialState: choicesAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder.addCase('cards-dealt', (state, event: CardsDealtEvent) => {
      choicesAdapter.addMany(state, event.cards);
    });
  },
});

export const choicesActions = choicesSlice.actions;
