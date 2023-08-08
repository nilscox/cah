import { Question, TurnStartedEvent } from '@cah/shared';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { gameFetched } from '../../use-cases/fetch-game/fetch-game';

export type QuestionSlice = Question;

export const questionsAdapter = createEntityAdapter<QuestionSlice>();

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
