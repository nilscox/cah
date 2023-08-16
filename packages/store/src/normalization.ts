import {
  AnonymousAnswer,
  Answer,
  Choice,
  Game,
  CurrentPlayer,
  Question,
  StartedGame,
  GamePlayer,
  Turn,
} from '@cah/shared';
import { NormalizedSchema, Schema, denormalize, normalize as normalizr, schema } from 'normalizr';

import { defined } from './defined';
import { AppState } from './types';

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
    turns: defined(entities.turns),
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
    questions: state.questions.entities as EntitiesMap<NormalizedQuestion>,
    choices: state.choices.entities as EntitiesMap<NormalizedChoice>,
    answers: state.answers.entities as EntitiesMap<NormalizedAnswer>,
    gamePlayers: state.players.entities as EntitiesMap<NormalizedGamePlayer>,
  };
}

export function denormalizeAnswer(state: CahNormalizedState, answerId: string): Answer {
  return denormalize(answerId, answer, state);
}
