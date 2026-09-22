import {
  type AnonymousAnswer,
  type Answer,
  type Choice,
  type CurrentPlayer,
  type Game,
  type GamePlayer,
  type Question,
  type StartedGame,
  type Turn,
} from '@cah/shared';
import { type NormalizedSchema, type Schema, denormalize, normalize as normalizr, schema } from 'normalizr';

import { defined } from './defined.ts';
import { type AppState } from './types.ts';

type Normalized<T, Relations extends keyof T = never> = Omit<T, Relations> & {
  [K in Relations]: T[K] extends unknown[] | undefined ? string[] : string;
};

const question = new schema.Entity('questions');

export type NormalizedQuestion = Normalized<Question>;

const choice = new schema.Entity('choices');

export type NormalizedChoice = Normalized<Choice>;

const answer = new schema.Entity('answers', {
  choices: [choice],
});

export type NormalizedAnswer = Normalized<Answer | AnonymousAnswer, 'choices'>;

const gamePlayer = new schema.Entity('gamePlayers');

export type NormalizedGamePlayer = Normalized<GamePlayer>;

const currentPlayer = new schema.Entity('currentPlayers', {
  cards: [choice],
  submittedAnswer: answer,
});

export type NormalizedCurrentPlayer = Normalized<CurrentPlayer, 'cards' | 'submittedAnswer'>;

const game = new schema.Entity('games', {
  players: [gamePlayer],
  questionMaster: gamePlayer,
  question: question,
  answers: [answer],
});

export type NormalizedGame = Normalized<StartedGame, 'players' | 'questionMaster' | 'question' | 'answers'>;

const turn = new schema.Entity('turns', {
  questionMaster: gamePlayer,
  question: question,
  answers: [answer],
});

export type NormalizedTurn = Normalized<Turn, 'question' | 'answers'>;

type EntitiesMap<Entity> = {
  [id: string]: Entity;
};

type CahNormalizedState = {
  questions?: EntitiesMap<NormalizedQuestion>;
  choices?: EntitiesMap<NormalizedChoice>;
  answers?: EntitiesMap<NormalizedAnswer>;
  games?: EntitiesMap<NormalizedGame>;
  gamePlayers?: EntitiesMap<NormalizedGamePlayer>;
  currentPlayers?: EntitiesMap<NormalizedCurrentPlayer>;
  turns?: EntitiesMap<NormalizedTurn>;
};

type CahNormalizedSchema = NormalizedSchema<CahNormalizedState, string>;

const normalize: (data: unknown, schema: Schema) => CahNormalizedSchema = normalizr;

export function normalizeGame(data: Game) {
  const { entities, result } = normalize(data, game);

  return {
    game: defined(entities.games)[result],
    players: entities.gamePlayers ?? {},
    questions: entities.questions ?? {},
    choices: entities.choices ?? {},
    answers: entities.answers ?? {},
  };
}

export function normalizeTurns(data: Turn[]) {
  const { entities } = normalize(data, [turn]);

  return {
    turns: entities.turns ?? {},
    players: entities.gamePlayers ?? {},
    questions: entities.questions ?? {},
    choices: entities.choices ?? {},
    answers: entities.answers ?? {},
  };
}

export function normalizeCurrentPlayer(data: CurrentPlayer) {
  const { entities, result } = normalize(data, currentPlayer);

  return {
    player: defined(entities.currentPlayers)[result],
    choices: entities.choices ?? {},
    answers: entities.answers ?? {},
  };
}

export function selectNormalizedState(state: AppState): CahNormalizedState {
  return {
    questions: state.questions.entities,
    choices: state.choices.entities,
    answers: state.answers.entities,
    gamePlayers: state.players.entities,
  };
}

export function denormalizeAnswer(state: CahNormalizedState, answerId: string): Answer {
  return denormalize(answerId, answer, state);
}
