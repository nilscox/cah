import { Answer } from '../domain/entities/Answer';
import { Choice } from '../domain/entities/Choice';
import { Game, GameState, PlayState, StartedGame } from '../domain/entities/Game';
import { FullPlayer, Player } from '../domain/entities/Player';
import { Question } from '../domain/entities/Question';

const createId = () => Math.random().toString(36).slice(-6);

export const createPlayer = (overrides: Partial<Player> = {}): Player => ({
  id: createId(),
  nick: 'nick',
  isConnected: false,
  ...overrides,
});

export const createFullPlayer = (overrides: Partial<FullPlayer> = {}): FullPlayer => ({
  ...createPlayer(),
  cards: [],
  ...overrides,
});

export const createGame = (overrides: Partial<Game> = {}): Game => ({
  id: createId(),
  code: 'code',
  state: GameState.idle,
  players: [],
  ...overrides,
});

export const createStartedGame = (overrides: Partial<StartedGame> = {}): StartedGame => ({
  ...createGame(),
  playState: PlayState.playersAnswer,
  questionMaster: createPlayer(),
  question: createQuestion(),
  answers: [],
  ...overrides,
  state: GameState.started,
});

export const createQuestion = (overrides: Partial<Question> = {}): Question => ({
  text: 'question',
  formatted: 'question',
  numberOfBlanks: 1,
  ...overrides,
});

export const createChoice = (overrides: Partial<Choice> = {}): Choice => ({
  id: createId(),
  text: 'choice',
  ...overrides,
});

export const createAnswer = (overrides: Partial<Answer> = {}): Answer => ({
  id: createId(),
  formatted: 'answer',
  choices: [],
  ...overrides,
});
