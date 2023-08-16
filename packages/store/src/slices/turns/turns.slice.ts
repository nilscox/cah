import { TurnEndedEvent } from '@cah/shared';
import { getId, getIds } from '@cah/utils';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { NormalizedTurn } from '../../normalization';
import { turnsFetched } from '../../use-cases/fetch-turns/fetch-turns';

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
