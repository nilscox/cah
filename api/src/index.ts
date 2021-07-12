import { CreateAnswerCommand, CreateAnswerCommandHandler } from './application/commands/CreateAnswerCommand';
import { NextTurnCommand, NextTurnHandler } from './application/commands/NextTurnCommand';
import { SelectWinnerCommand, SelectWinnerHandler } from './application/commands/SelectWinnerCommand';
import { StartGameCommand, StartGameHandler } from './application/commands/StartGameCommand';
import { GameService } from './application/services/GameService';
import { RandomService } from './application/services/RandomService';
import { InMemoryGameRepository } from './infrastructure/repositories/InMemoryGameRepository';
import { InMemoryPlayerRepository } from './infrastructure/repositories/InMemoryPlayerRepository';
import { StubEventPublisher } from './infrastructure/stubs/StubEventPublisher';
import { StubExternalData } from './infrastructure/stubs/StubExternalData';
import { bootstrapServer } from './infrastructure/web';
import { Route } from './infrastructure/web/Route';

const main = async () => {
  const playerRepository = new InMemoryPlayerRepository();
  const gameRepository = new InMemoryGameRepository();

  const gameService = new GameService(playerRepository, gameRepository);
  const randomService = new RandomService();
  const externalData = new StubExternalData();
  const publisher = new StubEventPublisher();

  const routes = [
    new Route('post', '/start')
      .dto((body) => new StartGameCommand(body.questionMasterId, body.turns))
      .use(new StartGameHandler(gameService, gameRepository, externalData, publisher)),

    new Route('post', '/answer')
      .dto((body) => new CreateAnswerCommand(body.playerId, body.cohicesIds))
      .use(new CreateAnswerCommandHandler(gameService, randomService, publisher)),

    new Route('post', '/select')
      .dto((body) => new SelectWinnerCommand(body.playerId, body.answerId))
      .use(new SelectWinnerHandler(gameService, publisher)),

    new Route('post', '/next')
      .dto((body) => new NextTurnCommand(body.playerId))
      .use(new NextTurnHandler(gameService, gameRepository, publisher)),
  ];

  const app = bootstrapServer(routes);
  const port = 4242;

  app.listen(port, () => console.log(`server started on port ${port}`));
};

main().catch(console.error);
