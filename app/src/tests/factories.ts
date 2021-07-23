import { Answer } from '../domain/entities/Answer';
import { Game, GameState, StartedGame } from '../domain/entities/Game';
import { Player } from '../domain/entities/Player';
import { Question } from '../domain/entities/Question';

export const createPlayer = (overrides: Partial<Player> = {}): Player => ({
  id: 'id',
  nick: 'nick',
  isConnected: false,
  ...overrides,
});

export const createGame = (overrides: Partial<Game | StartedGame> = {}): Game => ({
  id: 'id',
  code: 'code',
  state: GameState.idle,
  players: [],
  ...overrides,
});

export const createQuestion = (overrides: Partial<Question> = {}): Question => ({
  text: 'question',
  formatted: 'question',
  numberOfBlanks: 1,
  ...overrides,
});

export const createAnswer = (overrides: Partial<Answer> = {}): Answer => ({
  id: 'id',
  formatted: 'answer',
  choices: [],
  ...overrides,
});
