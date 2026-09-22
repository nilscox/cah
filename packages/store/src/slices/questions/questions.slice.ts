import { type TurnStartedEvent } from '@cah/shared';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { type NormalizedQuestion } from '../../normalization.ts';
import { gameFetched } from '../../use-cases/fetch-game/fetch-game.ts';
import { turnsFetched } from '../../use-cases/fetch-turns/fetch-turns.ts';

export const questionsAdapter = createEntityAdapter<NormalizedQuestion>();

export const questionsSlice = createSlice({
  name: 'questions',
  initialState: questionsAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder.addCase(gameFetched, (state, { questions }) => {
      questionsAdapter.addMany(state, questions);
    });

    builder.addCase(turnsFetched, (state, { questions }) => {
      questionsAdapter.addMany(state, questions);
    });

    builder.addCase('turn-started', (state, event: TurnStartedEvent) => {
      questionsAdapter.addOne(state, event.question);
    });
  },
});

export const questionActions = questionsSlice.actions;
