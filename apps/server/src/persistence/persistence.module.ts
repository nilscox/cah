import { declareModule, injectable } from 'ditox';

import { TOKENS } from 'src/tokens';

import { type AnswerRepository } from './repositories/answer/answer.repository.ts';
import { InMemoryAnswerRepository } from './repositories/answer/in-memory-answer.repository.ts';
import { SqlAnswerRepository } from './repositories/answer/sql-answer.repository.ts';
import { type ChoiceRepository } from './repositories/choice/choice.repository.ts';
import { InMemoryChoiceRepository } from './repositories/choice/in-memory-choice.repository.ts';
import { SqlChoiceRepository } from './repositories/choice/sql-choice.repository.ts';
import { type GameRepository } from './repositories/game/game.repository.ts';
import { InMemoryGameRepository } from './repositories/game/in-memory-game.repository.ts';
import { SqlGameRepository } from './repositories/game/sql-game.repository.ts';
import { InMemoryPlayerRepository } from './repositories/player/in-memory-player.repository.ts';
import { type PlayerRepository } from './repositories/player/player.repository.ts';
import { SqlPlayerRepository } from './repositories/player/sql-player.repository.ts';
import { InMemoryQuestionRepository } from './repositories/question/in-memory-question.repository.ts';
import { type QuestionRepository } from './repositories/question/question.repository.ts';
import { SqlQuestionRepository } from './repositories/question/sql-question.repository.ts';
import { InMemoryTurnRepository } from './repositories/turn/in-memory-turn.repository.ts';
import { SqlTurnRepository } from './repositories/turn/sql-turn.repository.ts';
import { type TurnRepository } from './repositories/turn/turn.repository.ts';

type PersistenceModule = {
  gameRepository: GameRepository;
  playerRepository: PlayerRepository;
  questionRepository: QuestionRepository;
  choiceRepository: ChoiceRepository;
  answerRepository: AnswerRepository;
  turnRepository: TurnRepository;
};

export const inMemoryPersistenceModule = declareModule<PersistenceModule>({
  factory: () => ({
    gameRepository: new InMemoryGameRepository(),
    playerRepository: new InMemoryPlayerRepository(),
    questionRepository: new InMemoryQuestionRepository(),
    choiceRepository: new InMemoryChoiceRepository(),
    answerRepository: new InMemoryAnswerRepository(),
    turnRepository: new InMemoryTurnRepository(),
  }),
  exports: {
    gameRepository: TOKENS.repositories.game,
    playerRepository: TOKENS.repositories.player,
    questionRepository: TOKENS.repositories.question,
    choiceRepository: TOKENS.repositories.choice,
    answerRepository: TOKENS.repositories.answer,
    turnRepository: TOKENS.repositories.turn,
  },
});

export const sqlPersistenceModule = declareModule<PersistenceModule>({
  factory: injectable(
    (db) => ({
      gameRepository: new SqlGameRepository(db),
      playerRepository: new SqlPlayerRepository(db),
      questionRepository: new SqlQuestionRepository(db),
      choiceRepository: new SqlChoiceRepository(db),
      answerRepository: new SqlAnswerRepository(db),
      turnRepository: new SqlTurnRepository(db),
    }),
    TOKENS.database,
  ),
  exports: {
    gameRepository: TOKENS.repositories.game,
    playerRepository: TOKENS.repositories.player,
    questionRepository: TOKENS.repositories.question,
    choiceRepository: TOKENS.repositories.choice,
    answerRepository: TOKENS.repositories.answer,
    turnRepository: TOKENS.repositories.turn,
  },
});
