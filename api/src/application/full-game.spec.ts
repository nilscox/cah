import _ from 'lodash';

import { GameState } from '../domain/enums/GameState';
import { Answer } from '../domain/models/Answer';
import { Choice } from '../domain/models/Choice';
import { Game, StartedGame } from '../domain/models/Game';
import { Player } from '../domain/models/Player';
import { InMemoryGameRepository } from '../infrastructure/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../infrastructure/InMemoryPlayerRepository';
import { StubEventPublisher } from '../infrastructure/StubEventPublisher';
import { StubExternalData } from '../infrastructure/StubExternalData';

import { CreateAnswerCommandHandler } from './commands/CreateAnswerCommand';
import { NextTurnHandler } from './commands/NextTurnCommand';
import { SelectWinnerHandler } from './commands/SelectWinnerCommand';
import { StartGameHandler } from './commands/StartGameCommand';
import { GameService } from './services/GameService';

describe('full game', () => {
  let gameRepository: InMemoryGameRepository;
  let playerRepository: InMemoryPlayerRepository;
  let gameService: GameService;
  let externalData: StubExternalData;
  let publisher: StubEventPublisher;

  let startGameHandler: StartGameHandler;
  let createAnswerHandler: CreateAnswerCommandHandler;
  let selectWinnerHandler: SelectWinnerHandler;
  let nextTurnHandler: NextTurnHandler;

  beforeEach(() => {
    gameRepository = new InMemoryGameRepository();
    playerRepository = new InMemoryPlayerRepository();
    gameService = new GameService(playerRepository, gameRepository);
    externalData = new StubExternalData();
    publisher = new StubEventPublisher();

    startGameHandler = new StartGameHandler(gameService, gameRepository, externalData, publisher);
    createAnswerHandler = new CreateAnswerCommandHandler(gameService, publisher);
    selectWinnerHandler = new SelectWinnerHandler(gameService, publisher);
    nextTurnHandler = new NextTurnHandler(gameService, gameRepository, publisher);
  });

  const startGame = (questionMaster: Player, turns: number) => {
    return startGameHandler.execute({ questionMasterId: questionMaster.id, turns });
  };

  const createAnswer = (player: Player, choices: Choice[]) => {
    return createAnswerHandler.execute({ playerId: player.id, choicesIds: _.map(choices, 'id') });
  };

  const selectWinnerAnswer = (player: Player, answer: Answer) => {
    return selectWinnerHandler.execute({ playerId: player.id, answerId: answer.id });
  };

  const nextTurn = (player: Player) => {
    return nextTurnHandler.execute({ playerId: player.id });
  };

  it('plays a full game of 20 turns with 5 players', async () => {
    const game = new Game();
    const startedGame = game as StartedGame;

    const players = [1, 2, 3, 4, 5].map((n) => new Player(`player ${n}`));

    for (const player of players) {
      await playerRepository.save(player);
      game.addPlayer(player);
    }

    await gameRepository.save(game);

    await startGame(players[0], 20);

    while (game.state !== GameState.finished) {
      for (const player of startedGame.playersExcludingQM) {
        await createAnswer(player, player.getFirstCards(1));
      }

      await selectWinnerAnswer(startedGame.questionMaster, startedGame.answers[0]);
      await nextTurn(startedGame.questionMaster);
    }
  });
});
