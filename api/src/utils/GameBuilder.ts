import { PlayState } from '../../../shared/enums';
import { GameRepository } from '../application/interfaces/GameRepository';
import { PlayerRepository } from '../application/interfaces/PlayerRepository';
import { Game, StartedGame } from '../domain/models/Game';
import { Player } from '../domain/models/Player';
import { ExternalData } from '../infrastructure/ExternalData';

export class GameBuilder<G extends Game = Game> {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly playerRepository: PlayerRepository,
    private readonly externalData: ExternalData,
  ) {}

  public randomize = <T>(array: T[]): T[] => array;

  private game = new Game({ creator: new Player('creator') });

  private functions: Array<(game: Game) => Promise<void>> = [];

  private register(func: (game: Game) => Promise<void>) {
    this.functions.push(func);
  }

  from(game: Game) {
    this.game = game;

    return this;
  }

  addPlayer(player = new Player('player')): GameBuilder<G> {
    this.register(async (game: Game) => {
      await this.playerRepository.save(player);
      game.addPlayer(player);
    });

    return this;
  }

  addPlayers(count = 3): GameBuilder<G> {
    this.register(async (game: Game) => {
      for (let i = 0; i < count; ++i) {
        const player = new Player(`player ${i + 1}`);

        await this.playerRepository.save(player);
        game.addPlayer(player);
      }
    });

    return this;
  }

  start(turns = 1): GameBuilder<StartedGame> {
    this.register(async (game: Game) => {
      const questions = await this.externalData.pickRandomQuestions(turns);
      const choices = await this.externalData.pickRandomChoices(game.computeNeededChoicesCount(questions));

      await this.gameRepository.addQuestions(game.id, questions);
      await this.gameRepository.addChoices(game.id, choices);

      game.start(game.players[0], questions[0]);
      game.dealCards(choices);
    });

    return this as GameBuilder<StartedGame>;
  }

  private async playTurn(game: StartedGame, to?: PlayState) {
    if (to === PlayState.playersAnswer) {
      return;
    }

    for (const player of game.playersExcludingQM) {
      game.addAnswer(player, player.getFirstCards(game.question.numberOfBlanks), this.randomize);
    }

    if (to === PlayState.questionMasterSelection) {
      return;
    }

    game.setWinningAnswer(game.questionMaster, game.answers[0].id);

    if (to === PlayState.endOfTurn) {
      return;
    }

    await this.gameRepository.addTurn(game.id, game.currentTurn);

    const nextQuestion = await this.gameRepository.findNextAvailableQuestion(game.id);

    if (nextQuestion) {
      game.nextTurn(nextQuestion);
      game.dealCards(await this.gameRepository.findAvailableChoices(game.id));
    } else {
      game.finish();
    }
  }

  play(to?: PlayState): GameBuilder<G> {
    this.register((game: Game) => this.playTurn(game as StartedGame, to));

    return this;
  }

  finish(): GameBuilder<G> {
    this.register(async (game: Game) => {
      while (game.isStarted()) {
        await this.playTurn(game);
      }
    });

    return this;
  }

  async get(): Promise<G> {
    const game = this.game;

    await this.playerRepository.save(game.creator);
    await this.gameRepository.save(game);

    for (const func of this.functions) {
      await func(game);
    }

    await this.playerRepository.save(game.players);
    await this.gameRepository.save(game);

    game.dropEvents();
    game.players.forEach((player) => player.dropEvents());

    this.game = new Game({ creator: new Player('creator') });
    this.functions = [];

    return game as G;
  }
}
