import { type TurnEndedEvent } from '@cah/shared';
import { getId, getIds } from '@cah/utils';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { type NormalizedTurn } from '../../normalization.ts';
import { turnsFetched } from '../../use-cases/fetch-turns/fetch-turns.ts';

export const turnsAdapter = createEntityAdapter<NormalizedTurn>();

export const turnsSlice = createSlice({
  name: 'turns',
  initialState: turnsAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder.addCase(turnsFetched, (state, { turns }) => {
      turnsAdapter.addMany(state, turns);
    });

    builder.addCase('turn-ended', (state, { turn }: TurnEndedEvent) => {
      turnsAdapter.addOne(state, {
        id: turn.id,
        number: turn.number,
        answers: getIds(turn.answers),
        question: getId(turn.question),
        selectedAnswerId: turn.selectedAnswerId,
      });
    });
  },
});

export const turnActions = turnsSlice.actions;
