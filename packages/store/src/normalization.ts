import { Answer, Choice, Game, Player, Question, StartedGame } from '@cah/shared';
import { NormalizedSchema, normalize, schema } from 'normalizr';

const question = new schema.Entity('questions');

const choice = new schema.Entity('choices');

const answers = new schema.Entity('answers', {
  choices: [choice],
});

const players = new schema.Entity('players', {
  cards: [choice],
});

const games = new schema.Entity('games', {
  players: [players],
  questionMaster: players,
  question: question,
  answers: [answers],
});

type Normalized<T, Relations extends keyof T = never> = Omit<T, Relations> & {
  [K in Relations]: T[K] extends unknown[] | undefined ? string[] : string;
};

type EntitiesMap<T, Relations extends keyof T = never> = {
  [id: string]: Normalized<T, Relations>;
};

type Entities = {
  questions?: EntitiesMap<Question>;
  choices?: EntitiesMap<Choice>;
  answers?: EntitiesMap<Answer, 'choices'>;
  players?: EntitiesMap<Player, 'cards'>;
  games?: EntitiesMap<StartedGame, 'players' | 'questionMaster' | 'question' | 'answers'>;
};

type NormalizeResult = NormalizedSchema<Entities, string>;

export function normalizeGame(data: Game): NormalizeResult {
  return normalize(data, games);
}

export function normalizePlayer(data: Player): NormalizeResult {
  return normalize(data, players);
}

export function normalizeAnswer(data: Answer): NormalizeResult {
  return normalize(data, answers);
}
