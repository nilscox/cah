import { Game, GameState, PlayerJoinedEvent, PlayerLeftEvent, TurnStartedEvent } from '@cah/shared';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { assert } from '../../defined';

export type GameSlice = {
  id: string;
  code: string;
  state: GameState;
  players: string[];
};

export type StartedGameSlice = GameSlice & {
  questionMasterId: string;
  questionId: string;
  answersIds: string[];
  selectedAnswerId?: string;
};

const isStarted = (game: GameSlice | null): game is StartedGameSlice => {
  return game?.state === GameState.started;
};

export const gameSlice = createSlice({
  name: 'game',
  initialState: null as GameSlice | null,
  reducers: {
    setGame(_, action: PayloadAction<Game>) {
      return {
        ...action.payload,
        players: action.payload.players.map((player) => player.id),
      };
    },
  },
  extraReducers(builder) {
    builder.addCase('player-joined', (state, action: PlayerJoinedEvent) => {
      if (state) {
        state.players.push(action.playerId);
      }
    });

    builder.addCase('player-left', (state, action: PlayerLeftEvent) => {
      assert(state);
      state.players.splice(state.players.indexOf(action.playerId), 1);
    });

    builder.addCase('game-started', (state) => {
      assert(state);
      state.state = GameState.started;
    });

    builder.addCase('turn-started', (state, action: TurnStartedEvent) => {
      assert(isStarted(state));

      state.questionMasterId = action.questionMasterId;
      state.questionId = action.question.id;
      state.answersIds = [];
    });
  },
});

export const gameActions = gameSlice.actions;
