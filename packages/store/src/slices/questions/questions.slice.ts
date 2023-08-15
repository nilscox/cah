import { TurnStartedEvent } from '@cah/shared';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { NormalizedQuestion } from '../../normalization';
import { gameFetched } from '../../use-cases/fetch-game/fetch-game';

export const questionsAdapter = createEntityAdapter<NormalizedQuestion>();

export const questionsSlice = createSlice({
  name: 'questions',
  initialState: questionsAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder.addCase(gameFetched, (state, { questions }) => {
      questionsAdapter.addMany(state, questions);
    });

    builder.addCase('turn-started', (state, event: TurnStartedEvent) => {
      questionsAdapter.addOne(state, event.question);
    });
  },
});

export const questionActions = questionsSlice.actions;
