import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Game, GamePlayer, isGameStarted, StartedGame } from '../../../domain/entities/game';
import { Turn } from '../../../domain/entities/Turn';

const startedGameReducer = <Payload>(reducer: CaseReducer<StartedGame, PayloadAction<Payload>>) => {
  return (game: GameSlice, action: PayloadAction<Payload>) => {
    if (!game) {
      throw new Error('startedGameReducer: game is not set');
    }

    if (!isGameStarted(game)) {
      throw new Error('startedGameReducer: game is not started');
    }

    reducer(game, action);
  };
};

type GameSlice = Game | StartedGame | null;

export const gameSlice = createSlice({
  name: 'game',
  initialState: null as GameSlice,
  reducers: {
    setGame(_, { payload }: PayloadAction<GameSlice>) {
      return payload;
    },
    updateGame(game, { payload }: PayloadAction<{ game: Partial<Game | StartedGame> }>) {
      if (!game) {
        throw new Error(`gameSlice.updateGame: game is not set`);
      }

      Object.assign(game, payload.game);
    },
    addPlayer(game, { payload }: PayloadAction<{ player: GamePlayer }>) {
      const { player } = payload;

      if (!game) {
        throw new Error('gameSlice.addPlayer: game is not set');
      }

      if (game.players[player.id]) {
        throw new Error(`gameSlice.addPlayer: player with id ${player.id} is already part of the game`);
      }

      game.players[player.id] = player;
    },
    removePlayer(game, { payload }: PayloadAction<{ playerId: string }>) {
      const { playerId } = payload;

      if (!game) {
        throw new Error('gameSlice.removePlayer: game is not set');
      }

      if (!game.players[playerId]) {
        throw new Error(`gameSlice.removePlayer: player with id ${playerId} does not exist in the game`);
      }

      delete game.players[playerId];
    },
    updatePlayer(game, { payload }: PayloadAction<{ playerId: string; changes: Partial<Omit<GamePlayer, 'id'>> }>) {
      const { playerId, changes } = payload;

      if (!game) {
        throw new Error('gameSlice.updatePlayer: game is not set');
      }

      if (!game.players[playerId]) {
        throw new Error(`gameSlice.updatePlayer: player with id ${playerId} does not exist in the game`);
      }

      game.players[playerId] = {
        ...game.players[playerId],
        ...changes,
      };
    },
    addTurns: startedGameReducer((game, { payload }: PayloadAction<{ turns: Turn[] }>) => {
      const { turns } = payload;

      game.turns.push(...turns);
    }),
  },
});
