import { Question, TurnStartedEvent } from '@cah/shared';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

export const questionsAdapter = createEntityAdapter<Question>();

const questionsSlice = createSlice({
  name: 'questions',
  initialState: questionsAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder.addCase('turn-started', (state, event: TurnStartedEvent) => {
      questionsAdapter.addOne(state, event.question);
    });
  },
});

export const { reducer: questionsReducer, actions: questionActions } = questionsSlice;
