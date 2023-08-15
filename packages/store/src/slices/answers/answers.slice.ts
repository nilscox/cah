import { AllPlayerAnsweredEvent, WinningAnswerSelectedEvent } from '@cah/shared';
import { PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { NormalizedAnswer } from '../../normalization';
import { gameFetched } from '../../use-cases/fetch-game/fetch-game';
import { playerFetched } from '../../use-cases/fetch-player/fetch-player';

type AnswerSlice = Omit<NormalizedAnswer, 'playerId'> & {
  playerId?: string;
};

export const answersAdapter = createEntityAdapter<AnswerSlice>();

export const answersSlice = createSlice({
  name: 'answers',
  initialState: answersAdapter.getInitialState(),
  reducers: {
    add(state, action: PayloadAction<AnswerSlice>) {
      answersAdapter.addOne(state, action.payload);
    },
  },
  extraReducers(builder) {
    builder.addCase(gameFetched, (state, { answers }) => {
      answersAdapter.addMany(state, answers);
    });

    builder.addCase(playerFetched, (state, { answers }) => {
      answersAdapter.addMany(state, answers);
    });

    builder.addCase('all-players-answered', (state, event: AllPlayerAnsweredEvent) => {
      answersAdapter.addMany(
        state,
        event.answers.map(
          (answer): AnswerSlice => ({
            id: answer.id,
            choices: answer.choices.map((choice) => choice.id),
          }),
        ),
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
