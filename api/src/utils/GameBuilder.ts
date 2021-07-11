import { PlayState } from '../domain/enums/PlayState';
import { ExternalData } from '../domain/interfaces/ExternalData';
import { GameRepository } from '../domain/interfaces/GameRepository';
import { PlayerRepository } from '../domain/interfaces/PlayerRepository';
import { Game } from '../domain/models/Game';
import { Player } from '../domain/models/Player';

export class GameBuilder {
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

  addPlayers(count = 3) {
    this.register(async () => {
      for (let i = 0; i < count; ++i) {
        const player = new Player(`player ${i}`);

        await this.playerRepository.save(player);
        this.game.addPlayer(player);
      }
    });

    return this;
  }

  start(turns = 1) {
    this.register(async () => {
      const game = this.game;

      const questions = await this.externalData.pickRandomQuestions(turns);
      const choices = await this.externalData.pickRandomChoices(game.computeNeededChoicesCount(questions));

      await this.gameRepository.addQuestions(game.id, questions);
      await this.gameRepository.addChoices(game.id, choices);

      this.game.start(this.game.players[0], questions[0]);
      this.game.dealCards(choices);
    });

    return this;
  }

  play(to: PlayState) {
    this.register(async () => {
      if (to === PlayState.playersAnswer) {
        return;
      }

      for (const player of this.game.playersExcludingQM) {
        this.game.addAnswer(player, player.getFirstCards(this.game.question!.numberOfBlanks));
      }

      if (to === PlayState.questionMasterSelection) {
        return;
      }

      // ...
    });

    return this;
  }

  async get() {
    const game = this.game;

    for (const func of this.functions) {
      await func();
    }

    await this.gameRepository.save(this.game);

    this.game = new Game();
    this.functions = [];

    return game;
  }
}
