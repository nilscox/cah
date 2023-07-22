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

export const playersRelations = relations(players, ({ one }) => ({
  game: one(games, { fields: [players.gameId], references: [games.id] }),
}));

export type SqlPlayer = InferModel<typeof players>;

export const questions = cah.table('questions', {
  id: primaryKey(),
  gameId: varchar('gameId')
    .notNull()
    .references(() => games.id),
  text: text('text').notNull(),
  blanks: integer('blanks').array().notNull(),
});

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
  answer: one(answers, { fields: [choices.answerId], references: [answers.id] }),
}));

export type SqlChoice = InferModel<typeof choices>;

export const answers = cah.table('answers', {
  id: primaryKey(),
  gameId: varchar('gameId')
    .notNull()
    .references(() => games.id),
  playerId: varchar('playerId')
    .notNull()
    .references(() => players.id),
  questionId: text('questionId')
    .notNull()
    .references(() => questions.id),
  place: integer('place'),
});

export const answersRelations = relations(answers, ({ one, many }) => ({
  game: one(games, { fields: [answers.gameId], references: [games.id] }),
  choices: many(choices),
}));

export type SqlAnswer = InferModel<typeof answers>;
