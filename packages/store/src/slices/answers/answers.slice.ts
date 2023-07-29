import { AllPlayerAnsweredEvent } from '@cah/shared';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

type AnswerSlice = {
  id: string;
  playerId?: string;
  choicesIds: string[];
};

const answersAdapter = createEntityAdapter<AnswerSlice>();

export const answersSlice = createSlice({
  name: 'answers',
  initialState: answersAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder.addCase('all-players-answered', (state, event: AllPlayerAnsweredEvent) => {
      answersAdapter.addMany(
        state,
        event.answers.map(({ choices, ...answer }) => ({
          ...answer,
          choicesIds: choices.map((choice) => choice.id),
        })),
      );
    });
  },
});
