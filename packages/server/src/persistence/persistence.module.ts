import { declareModule, injectable } from 'ditox';

import { TOKENS } from 'src/tokens';

import { AnswerRepository } from './repositories/answer/answer.repository';
import { InMemoryAnswerRepository } from './repositories/answer/in-memory-answer.repository';
import { SqlAnswerRepository } from './repositories/answer/sql-answer.repository';
import { ChoiceRepository } from './repositories/choice/choice.repository';
import { InMemoryChoiceRepository } from './repositories/choice/in-memory-choice.repository';
import { SqlChoiceRepository } from './repositories/choice/sql-choice.repository';
import { GameRepository } from './repositories/game/game.repository';
import { InMemoryGameRepository } from './repositories/game/in-memory-game.repository';
import { SqlGameRepository } from './repositories/game/sql-game.repository';
import { InMemoryPlayerRepository } from './repositories/player/in-memory-player.repository';
import { PlayerRepository } from './repositories/player/player.repository';
import { SqlPlayerRepository } from './repositories/player/sql-player.repository';
import { InMemoryQuestionRepository } from './repositories/question/in-memory-question.repository';
import { QuestionRepository } from './repositories/question/question.repository';
import { SqlQuestionRepository } from './repositories/question/sql-question.repository';

type PersistenceModule = {
  gameRepository: GameRepository;
  playerRepository: PlayerRepository;
  questionRepository: QuestionRepository;
  choiceRepository: ChoiceRepository;
  answerRepository: AnswerRepository;
};

export const inMemoryPersistenceModule = declareModule<PersistenceModule>({
  factory: () => ({
    gameRepository: new InMemoryGameRepository(),
    playerRepository: new InMemoryPlayerRepository(),
    questionRepository: new InMemoryQuestionRepository(),
    choiceRepository: new InMemoryChoiceRepository(),
    answerRepository: new InMemoryAnswerRepository(),
  }),
  exports: {
    gameRepository: TOKENS.repositories.game,
    playerRepository: TOKENS.repositories.player,
    questionRepository: TOKENS.repositories.question,
    choiceRepository: TOKENS.repositories.choice,
    answerRepository: TOKENS.repositories.answer,
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
    }),
    TOKENS.database,
  ),
  exports: {
    gameRepository: TOKENS.repositories.game,
    playerRepository: TOKENS.repositories.player,
    questionRepository: TOKENS.repositories.question,
    choiceRepository: TOKENS.repositories.choice,
    answerRepository: TOKENS.repositories.answer,
  },
});
