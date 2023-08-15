import { AnonymousAnswer, Answer, Choice, Game, Player, Question, StartedGame } from '@cah/shared';
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

const player = new schema.Entity('players', {
  cards: [choice],
  submittedAnswer: answer,
});

export type NormalizedPlayer = Normalized<Player, 'cards' | 'submittedAnswer'>;

const game = new schema.Entity('games', {
  players: [player],
  questionMaster: player,
  question: question,
  answers: [answer],
});

export type NormalizedGame = Normalized<StartedGame, 'players' | 'questionMaster' | 'question' | 'answers'>;

type EntitiesMap<Entity> = {
  [id: string]: Entity;
};

type CahNormalizedState = {
  questions: EntitiesMap<NormalizedQuestion>;
  choices: EntitiesMap<NormalizedChoice>;
  answers: EntitiesMap<NormalizedAnswer>;
  players: EntitiesMap<NormalizedPlayer>;
  games: EntitiesMap<NormalizedGame>;
};

type CahNormalizedSchema = NormalizedSchema<CahNormalizedState, string>;

const normalize: (data: unknown, schema: Schema) => CahNormalizedSchema = normalizr;

export function normalizeGame(data: Game) {
  const { entities, result } = normalize(data, game);

  return {
    game: defined(entities.games)[result],
    players: entities.players ?? {},
    questions: entities.questions ?? {},
    choices: entities.choices ?? {},
    answers: entities.answers ?? {},
  };
}

export function normalizePlayer(data: Player) {
  const { entities, result } = normalize(data, player);

  return {
    player: defined(entities.players)[result],
    choices: entities.choices ?? {},
    answers: entities.answers ?? {},
  };
}

export function selectNormalizedState(state: AppState): CahNormalizedState {
  return {
    questions: state.questions.entities as EntitiesMap<NormalizedQuestion>,
    choices: state.choices.entities as EntitiesMap<NormalizedChoice>,
    answers: state.answers.entities as EntitiesMap<NormalizedAnswer>,
    players: state.players.entities as EntitiesMap<NormalizedPlayer>,
    games: state.game ? { [state.game.id]: state.game as NormalizedGame } : {},
  };
}

export function denormalizeAnswer(state: CahNormalizedState, answerId: string): Answer {
  return denormalize(answerId, answer, state);
}
