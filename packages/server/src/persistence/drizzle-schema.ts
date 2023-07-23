import { GameState } from '@cah/shared';
import { InferModel, relations } from 'drizzle-orm';
import { AnyPgColumn, boolean, integer, pgEnum, pgSchema, text, varchar } from 'drizzle-orm/pg-core';

const typedPgEnum = <Enum extends object>(name: string, e: Enum) => {
  type T = keyof Enum extends string ? keyof Enum : never;
  return pgEnum<T, readonly [T, ...T[]]>(name, Object.values(e) as [T, ...T[]]);
};

const id = (name = 'id') => varchar(name, { length: 16 });
const primaryKey = () => id('id').primaryKey();

export const gameStateEnum = typedPgEnum('game_state', GameState);

export const cah = pgSchema('cah');

export const games = cah.table('games', {
  id: primaryKey(),
  // todo: unique
  code: varchar('code', { length: 4 }).notNull(),
  state: gameStateEnum('state').notNull(),
  questionMasterId: id('questionMasterId').references((): AnyPgColumn => players.id),
  questionId: id('questionId').references((): AnyPgColumn => questions.id),
  selectedAnswerId: id('selectedAnswerId').references((): AnyPgColumn => answers.id),
});

export const gamesRelations = relations(games, ({ one, many }) => ({
  players: many(players),
  answers: many(answers),
  selectedAnswer: one(answers, { fields: [games.selectedAnswerId], references: [answers.id] }),
}));

export type SqlGame = InferModel<typeof games>;

export const players = cah.table('players', {
  id: primaryKey(),
  nick: text('nick').notNull(),
  gameId: id('gameId').references(() => games.id),
});

export const playersRelations = relations(players, ({ one, many }) => ({
  game: one(games, { fields: [players.gameId], references: [games.id] }),
  cards: many(choices),
}));

export type SqlPlayer = InferModel<typeof players>;

export const questions = cah.table('questions', {
  id: primaryKey(),
  gameId: id('gameId')
    .notNull()
    .references(() => games.id),
  text: text('text').notNull(),
  blanks: integer('blanks').array().notNull(),
});

export const questionsRelations = relations(questions, ({ one }) => ({
  turn: one(turns),
}));

export type SqlQuestion = InferModel<typeof questions>;

export const choices = cah.table('choices', {
  id: primaryKey(),
  gameId: varchar('gameId')
    .notNull()
    .references(() => games.id),
  playerId: varchar('playerId').references(() => players.id),
  answerId: varchar('answerId').references(() => answers.id),
  text: text('text').notNull(),
  caseSensitive: boolean('caseSensitive').notNull(),
  place: integer('place'),
});

export const choicesRelations = relations(choices, ({ one }) => ({
  player: one(players, { fields: [choices.playerId], references: [players.id] }),
  answer: one(answers, { fields: [choices.answerId], references: [answers.id] }),
}));

export type SqlChoice = InferModel<typeof choices>;

export const answers = cah.table('answers', {
  id: primaryKey(),
  gameId: id('gameId')
    .notNull()
    .references(() => games.id),
  playerId: id('playerId')
    .notNull()
    .references(() => players.id),
  questionId: id('questionId')
    .notNull()
    .references(() => questions.id),
  turnId: id('turnId').references((): AnyPgColumn => turns.id),
  place: integer('place'),
});

export const answersRelations = relations(answers, ({ one, many }) => ({
  game: one(games, { fields: [answers.gameId], references: [games.id] }),
  choices: many(choices),
  turn: one(turns, { fields: [answers.turnId], references: [turns.id] }),
}));

export type SqlAnswer = InferModel<typeof answers>;

export const turns = cah.table('turns', {
  id: primaryKey(),
  // todo: unique
  number: integer('number').notNull(),
  gameId: id('gameId')
    .notNull()
    .references(() => games.id),
  questionMasterId: id('questionMasterId')
    .notNull()
    .references(() => players.id),
  questionId: id('questionId')
    .notNull()
    .references(() => questions.id),
  selectedAnswerId: id('selectedAnswerId')
    .notNull()
    .references(() => answers.id),
});

export type SqlTurn = InferModel<typeof turns>;

export const turnsRelations = relations(turns, ({ one, many }) => ({
  game: one(games, { fields: [turns.gameId], references: [games.id] }),
  questionMaster: one(players, { fields: [turns.questionMasterId], references: [players.id] }),
  question: one(questions, { fields: [turns.questionId], references: [questions.id] }),
  selectedAnswer: one(answers, { fields: [turns.selectedAnswerId], references: [answers.id] }),
  answers: many(answers),
}));
