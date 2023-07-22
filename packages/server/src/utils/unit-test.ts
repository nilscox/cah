import {
  StubRandomAdapter,
  StubEventPublisherAdapter,
  StubExternalDataAdapter,
  StubGeneratorAdapter,
} from 'src/adapters';
import {
  InMemoryGameRepository,
  InMemoryPlayerRepository,
  InMemoryQuestionRepository,
  InMemoryChoiceRepository,
  InMemoryAnswerRepository,
} from 'src/persistence';

export class UnitTest {
  generator = new StubGeneratorAdapter();
  random = new StubRandomAdapter();
  publisher = new StubEventPublisherAdapter();
  externalData = new StubExternalDataAdapter();

  gameRepository = new InMemoryGameRepository();
  playerRepository = new InMemoryPlayerRepository();
  questionRepository = new InMemoryQuestionRepository();
  choiceRepository = new InMemoryChoiceRepository();
  answerRepository = new InMemoryAnswerRepository();
}
