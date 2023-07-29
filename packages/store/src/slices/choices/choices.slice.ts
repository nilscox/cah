import { AllPlayerAnsweredEvent, CardsDealtEvent, Choice } from '@cah/shared';
import { PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

type ChoiceSlice = {
  id: string;
  text: string;
  caseSensitive: boolean;
};

export const choicesAdapter = createEntityAdapter<ChoiceSlice>();

export const choicesSlice = createSlice({
  name: 'choices',
  initialState: choicesAdapter.getInitialState(),
  reducers: {
    add(state, action: PayloadAction<Choice>) {
      choicesAdapter.addOne(state, action.payload);
    },
  },
  extraReducers(builder) {
    builder.addCase('cards-dealt', (state, event: CardsDealtEvent) => {
      choicesAdapter.addMany(state, event.cards);
    });

    builder.addCase('all-players-answered', (state, event: AllPlayerAnsweredEvent) => {
      choicesAdapter.addMany(
        state,
        event.answers.flatMap(({ choices }) => choices),
      );
    });
  },
});

export const choicesActions = choicesSlice.actions;
