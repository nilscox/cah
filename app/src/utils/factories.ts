import { Game, GameState } from '../interfaces/entities/Game';
import { Player } from '../interfaces/entities/Player';

export const createPlayer = (overrides: Partial<Player> = {}): Player => ({
  id: 'id',
  nick: 'nick',
  isConnected: false,
  ...overrides,
});

export const createGame = (overrides: Partial<Game> = {}): Game => ({
  id: 'id',
  code: 'code',
  state: GameState.idle,
  players: [],
  ...overrides,
});
