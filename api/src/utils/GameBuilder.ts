import { PlayState } from '../domain/enums/PlayState';
import { ExternalData } from '../domain/interfaces/ExternalData';
import { GameRepository } from '../domain/interfaces/GameRepository';
import { PlayerRepository } from '../domain/interfaces/PlayerRepository';
import { Game, StartedGame } from '../domain/models/Game';
import { Player } from '../domain/models/Player';

export class GameBuilder<G extends Game = Game> {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly playerRepository: PlayerRepository,
    private readonly externalData: ExternalData,
  ) {}

  private game: Game = new Game();
  private functions: Array<() => Promise<void>> = [];

  private register(func: () => Promise<void>) {
    this.functions.push(func);
  }

  addPlayers(count = 3): GameBuilder<G> {
    this.register(async () => {
      for (let i = 0; i < count; ++i) {
        const player = new Player(`player ${i + 1}`);

        await this.playerRepository.save(player);
        this.game.addPlayer(player);
      }
    });

    return this;
  }

  start(turns = 1): GameBuilder<StartedGame> {
    this.register(async () => {
      const game = this.game;

      const questions = await this.externalData.pickRandomQuestions(turns);
      const choices = await this.externalData.pickRandomChoices(game.computeNeededChoicesCount(questions));

      await this.gameRepository.addQuestions(game.id, questions);
      await this.gameRepository.addChoices(game.id, choices);

      this.game.start(this.game.players[0], questions[0]);
      this.game.dealCards(choices);
    });

    return this as GameBuilder<StartedGame>;
  }

  play(to: PlayState): GameBuilder<G> {
    this.register(async () => {
      const game = this.game as StartedGame;

      if (to === PlayState.playersAnswer) {
        return;
      }

      for (const player of this.game.playersExcludingQM) {
        this.game.addAnswer(player, player.getFirstCards(game.question.numberOfBlanks), (arr) => arr);
      }

      if (to === PlayState.questionMasterSelection) {
        return;
      }

      game.setWinningAnswer(game.questionMaster, game.answers[0].id);

      if (to === PlayState.endOfTurn) {
        return;
      }

      const nextQuestion = await this.gameRepository.findNextAvailableQuestion(game.id);

      if (nextQuestion) {
        game.nextTurn(nextQuestion);
        game.dealCards(await this.gameRepository.findAvailableChoices(game.id));
      } else {
        game.finish();
      }
    });

    return this;
  }

  async get(): Promise<G> {
    const game = this.game;

    await this.gameRepository.save(this.game);

    for (const func of this.functions) {
      await func();
    }

    await this.gameRepository.save(this.game);

    this.game.dropEvents();
    this.game.players.forEach((player) => player.dropEvents());

    this.game = new Game();
    this.functions = [];

    return game as G;
  }
}
