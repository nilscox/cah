import {
  AllPlayerAnsweredEvent,
  Game,
  GameState,
  PlayerJoinedEvent,
  PlayerLeftEvent,
  TurnStartedEvent,
  WinningAnswerSelectedEvent,
} from '@cah/shared';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { assert } from '../../defined';

export type GameSlice = {
  id: string;
  code: string;
  state: GameState;
  playersIds: string[];
};

export type StartedGameSlice = GameSlice & {
  questionMasterId: string;
  questionId: string;
  answersIds: string[];
  isAnswerValidated: boolean;
  selectedAnswerId?: string;
};

export const isStarted = (game: GameSlice | null): game is StartedGameSlice => {
  return game?.state === GameState.started;
};

export const gameSlice = createSlice({
  name: 'game',
  initialState: null as GameSlice | null,
  reducers: {
    setGame(_, action: PayloadAction<Game>) {
      const { players, ...game } = action.payload;

      return {
        ...game,
        playersIds: players.map((player) => player.id),
      };
    },

    setSelectedAnswer(state, action: PayloadAction<string>) {
      assert(isStarted(state));

      state.selectedAnswerId = action.payload;
    },

    setAnswerValidated(state) {
      assert(isStarted(state));

      state.isAnswerValidated = true;
    },
  },
  extraReducers(builder) {
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

      assert(isStarted(state));

      state.answersIds = [];
      state.isAnswerValidated = false;
    });

    builder.addCase('turn-started', (state, action: TurnStartedEvent) => {
      assert(isStarted(state));

      state.questionMasterId = action.questionMasterId;
      state.questionId = action.question.id;
    });

    builder.addCase('all-players-answered', (state, event: AllPlayerAnsweredEvent) => {
      assert(isStarted(state));

      state.answersIds = event.answers.map((answer) => answer.id);
    });

    builder.addCase('winning-answer-selected', (state, event: WinningAnswerSelectedEvent) => {
      assert(isStarted(state));

      state.selectedAnswerId = event.selectedAnswerId;
      state.isAnswerValidated = true;
    });

    builder.addCase('turn-ended', (state) => {
      assert(isStarted(state));

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
