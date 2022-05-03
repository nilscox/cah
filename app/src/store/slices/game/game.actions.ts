import { Game, GamePlayer, StartedGame } from '../../../domain/entities/game';
import { Turn } from '../../../domain/entities/Turn';

import { gameSlice } from './game.slice';

const { setGame, updateGame, addPlayer, removePlayer, updatePlayer, addTurns } = gameSlice.actions;

export const gameActions = {
  setGame(game: Game | StartedGame) {
    return setGame(game);
  },

  updateGame(game: Partial<Game | StartedGame>) {
    return updateGame({ game });
  },

  unsetGame() {
    return setGame(null);
  },

  addPlayer(player: GamePlayer) {
    return addPlayer({ player });
  },

  removePlayer(player: GamePlayer) {
    return removePlayer({ playerId: player.id });
  },

  updatePlayer(playerId: string, changes: Partial<Omit<GamePlayer, 'id'>>) {
    return updatePlayer({ playerId, changes });
  },

  addTurn(turn: Turn) {
    return addTurns({ turns: [turn] });
  },

  addTurns(turns: Turn[]) {
    return addTurns({ turns });
  },
};
