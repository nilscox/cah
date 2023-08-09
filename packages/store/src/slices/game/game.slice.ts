import {
  AllPlayerAnsweredEvent,
  GameState,
  PlayerJoinedEvent,
  PlayerLeftEvent,
  TurnStartedEvent,
  WinningAnswerSelectedEvent,
} from '@cah/shared';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { assert } from '../../defined';
import { unauthenticated } from '../../use-cases/clear-authentication/clear-authentication';
import { gameFetched } from '../../use-cases/fetch-game/fetch-game';
import { gameLeft } from '../../use-cases/leave-game/leave-game';

export type GameSlice = {
  id: string;
  code: string;
  state: GameState;
  playersIds: string[];
  questionMasterId?: string;
  questionId?: string;
  answersIds?: string[];
  isAnswerValidated?: boolean;
  selectedAnswerId?: string;
};

export enum PlayState {
  playersAnswer = 'playersAnswer',
  questionMasterSelection = 'questionMasterSelection',
  endOfTurn = 'endOfTurn',
}

export const gameSlice = createSlice({
  name: 'game',
  initialState: null as GameSlice | null,
  reducers: {
    setSelectedAnswer(state, action: PayloadAction<string>) {
      assert(state);

      state.selectedAnswerId = action.payload;
    },

    setAnswerValidated(state) {
      assert(state);

      state.isAnswerValidated = true;
    },
  },
  extraReducers(builder) {
    builder.addCase(gameFetched, (state, { game }) => ({
      id: game.id,
      code: game.code,
      playersIds: game.players,
      state: game.state,
      questionMasterId: game.questionMaster,
      questionId: game.question,
      answersIds: game.answers,
      selectedAnswerId: game.selectedAnswerId,
      isAnswerValidated: game.selectedAnswerId !== undefined,
    }));

    builder.addCase(gameLeft, () => {
      return null;
    });

    builder.addCase(unauthenticated, () => {
      return null;
    });

    builder.addCase('player-joined', (state, action: PlayerJoinedEvent) => {
      if (state) {
        state.playersIds.push(action.playerId);
      }
    });

    builder.addCase('player-left', (state, action: PlayerLeftEvent) => {
      assert(state);

      state.playersIds.splice(state.playersIds.indexOf(action.playerId), 1);
    });

    builder.addCase('game-started', (state) => {
      assert(state);

      state.state = GameState.started;

      state.answersIds = [];
      state.isAnswerValidated = false;
    });

    builder.addCase('turn-started', (state, action: TurnStartedEvent) => {
      assert(state);

      state.questionMasterId = action.questionMasterId;
      state.questionId = action.question.id;
    });

    builder.addCase('all-players-answered', (state, event: AllPlayerAnsweredEvent) => {
      assert(state);

      state.answersIds = event.answers.map((answer) => answer.id);
    });

    builder.addCase('winning-answer-selected', (state, event: WinningAnswerSelectedEvent) => {
      assert(state);

      state.selectedAnswerId = event.selectedAnswerId;
      state.isAnswerValidated = true;
    });

    builder.addCase('turn-ended', (state) => {
      assert(state);

      state.answersIds = [];
      delete state.selectedAnswerId;
      state.isAnswerValidated = false;
    });

    builder.addCase('game-ended', (state) => {
      assert(state);

      return {
        id: state.id,
        code: state.code,
        state: GameState.finished,
        playersIds: state.playersIds,
      };
    });
  },
});

export const gameActions = gameSlice.actions;
