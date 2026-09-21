import { defineRelations } from 'drizzle-orm';
import * as schema from './drizzle-schema';

export const relations = defineRelations(schema, (r) => ({
  games: {
    players: r.many.players(),
    questionMaster: r.one.players({
      from: r.games.questionMasterId,
      to: r.players.id,
      optional: false,
    }),
    question: r.one.questions({
      from: r.games.questionId,
      to: r.questions.id,
    }),
    answers: r.many.answers(),
    selectedAnswer: r.one.answers({
      from: r.games.selectedAnswerId,
      to: r.answers.id,
    }),
  },

  players: {
    game: r.one.games({
      from: r.players.gameId,
      to: r.games.id,
      optional: false,
    }),
    cards: r.many.choices(),
  },

  questions: {
    turn: r.one.turns(),
  },

  choices: {
    player: r.one.players({
      from: r.choices.playerId,
      to: r.players.id,
      optional: false,
    }),
    answer: r.one.answers({
      from: r.choices.answerId,
      to: r.answers.id,
      optional: false,
    }),
  },

  answers: {
    game: r.one.games({
      from: r.answers.gameId,
      to: r.games.id,
      optional: false,
    }),
    choices: r.many.choices(),
    turn: r.one.turns({
      from: r.answers.turnId,
      to: r.turns.id,
      optional: false,
    }),
  },

  turns: {
    game: r.one.games({
      from: r.turns.gameId,
      to: r.games.id,
      optional: false,
    }),
    questionMaster: r.one.players({
      from: r.turns.questionMasterId,
      to: r.players.id,
      optional: false,
    }),
    question: r.one.questions({
      from: r.turns.questionId,
      to: r.questions.id,
      optional: false,
    }),
    selectedAnswer: r.one.answers({
      from: r.turns.selectedAnswerId,
      to: r.answers.id,
    }),
    answers: r.many.answers(),
  },
}));
