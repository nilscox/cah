import { CardsDealtEvent, Choice, TurnStartedEvent } from '@cah/shared';
import { array, getIds } from '@cah/utils';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { assert } from '../../defined';
import { unauthenticated } from '../../use-cases/clear-authentication/clear-authentication';
import { gameFetched } from '../../use-cases/fetch-game/fetch-game';
import { playerFetched } from '../../use-cases/fetch-player/fetch-player';
import { gameLeft } from '../../use-cases/leave-game/leave-game';

export type PlayerSlice = {
  id: string;
  nick: string;
  gameId?: string;
  cardsIds?: string[];
  selectedChoicesIds?: Array<string | null>;
  answerSubmitted?: boolean;
};

export const playerSlice = createSlice({
  name: 'player',
  initialState: null as PlayerSlice | null,
  reducers: {
    setSelectedChoice(state, action: PayloadAction<[choiceId: string, index: number]>) {
      assert(state);
      assert(state.selectedChoicesIds);

      const [choiceId, index] = action.payload;

      state.selectedChoicesIds[index] = choiceId;
    },

    clearSelectedChoice(state, action: PayloadAction<number>) {
      assert(state);
      assert(state.selectedChoicesIds);

      const index = action.payload;

      state.selectedChoicesIds[index] = null;
    },

    removeCards(state, action: PayloadAction<string[]>) {
      assert(state);
      assert(state.cardsIds);

      for (const choiceId of action.payload) {
        removeArrayElement(state.cardsIds, choiceId);
      }
    },

    addCards(state, action: PayloadAction<Choice[]>) {
      assert(state);
      assert(state.cardsIds);

      state.cardsIds.push(...getIds(action.payload));
    },

    answerSubmitted(state) {
      assert(state);

      state.answerSubmitted = true;
    },
  },
  extraReducers(builder) {
    builder.addCase(gameFetched, (state, { game, questions }) => {
      assert(state);

      state.gameId = game.id;

      if (game?.question && !state.selectedChoicesIds) {
        const question = questions[game.question];
        state.selectedChoicesIds = array(question.blanks?.length ?? 1, () => null);
      }
    });

    builder.addCase(playerFetched, (state, { player, choices, answers }) => {
      let selectedChoicesIds: Array<string> | undefined = undefined;
      let cardsIds = player.cards;

      if (player.cards) {
        cardsIds = player.cards;
      }

      if (player.submittedAnswer) {
        const answer = answers[player.submittedAnswer];
        const answerChoices = answer.choices.map((choice) => choices[choice]);

        selectedChoicesIds = getIds(answerChoices);
        cardsIds?.unshift(...selectedChoicesIds);
      }

      return {
        id: player.id,
        nick: player.nick,
        gameId: player.gameId,
        cardsIds,
        selectedChoicesIds,
        answerSubmitted: player.gameId ? player.submittedAnswer !== undefined : undefined,
      };
    });

    builder.addCase(gameLeft, (state) => {
      delete state?.gameId;
    });

    builder.addCase(unauthenticated, () => {
      return null;
    });

    builder.addCase('game-started', (state) => {
      assert(state);

      state.cardsIds = [];
      state.selectedChoicesIds = [];
    });

    builder.addCase('turn-started', (state, event: TurnStartedEvent) => {
      assert(state);

      state.selectedChoicesIds = array(event.question.blanks?.length || 1, () => null);
    });

    builder.addCase('turn-ended', (state) => {
      assert(state);
      assert(state.cardsIds);
      assert(state.selectedChoicesIds);

      for (const choiceId of state.selectedChoicesIds) {
        removeArrayElement(state.cardsIds, choiceId);
      }

      state.selectedChoicesIds = [];
      state.answerSubmitted = false;
    });

    builder.addCase('cards-dealt', (state, event: CardsDealtEvent) => {
      assert(state);
      assert(state.cardsIds);

      state.cardsIds.push(...event.cards.map((choice) => choice.id));
    });
  },
});

export const playerActions = playerSlice.actions;

const removeArrayElement = <T>(array: T[], item: T) => {
  const index = array.indexOf(item);

  if (index >= 0) {
    array.splice(index, 1);
  }
};
