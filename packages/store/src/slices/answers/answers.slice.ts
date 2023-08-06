import { AllPlayerAnsweredEvent, AnonymousAnswer, Answer, WinningAnswerSelectedEvent } from '@cah/shared';
import { PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { setEntities } from '../../store/set-entities';

export type AnswerSlice = {
  id: string;
  playerId?: string;
  choicesIds: string[];
};

export const answersAdapter = createEntityAdapter<AnswerSlice>();

export const answersSlice = createSlice({
  name: 'answers',
  initialState: answersAdapter.getInitialState(),
  reducers: {
    add(state, action: PayloadAction<Answer | AnonymousAnswer>) {
      const { choices, ...answer } = action.payload;

      answersAdapter.addOne(state, {
        ...answer,
        choicesIds: choices.map((choice) => choice.id),
      });
    },
  },
  extraReducers(builder) {
    builder.addCase(setEntities, (state, action) => {
      const answers = Object.values(action.payload.entities.answers ?? {});

      answersAdapter.addMany(
        state,
        answers.map((answer) => ({
          id: answer.id,
          playerId: answer.playerId,
          choicesIds: answer.choices,
        })),
      );
    });

    builder.addCase('all-players-answered', (state, event: AllPlayerAnsweredEvent) => {
      answersAdapter.addMany(
        state,
        event.answers.map(({ choices, ...answer }) => ({
          ...answer,
          choicesIds: choices.map((choice) => choice.id),
        })),
      );
    });

    builder.addCase('winning-answer-selected', (state, event: WinningAnswerSelectedEvent) => {
      answersAdapter.updateMany(
        state,
        event.answers.map((answer) => ({
          id: answer.id,
          changes: { playerId: answer.playerId },
        })),
      );
    });
  },
});

export const answersActions = answersSlice.actions;
