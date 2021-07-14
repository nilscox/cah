import { GameService } from '../services/GameService';

export class GetGameQuery {
  constructor(public readonly gameId: string) {}
}

export class GetGameHandler {
  constructor(private readonly gameService: GameService) {}

  async execute({ gameId }: GetGameQuery) {
    const game = await this.gameService.getGame(gameId);

    const result = {
      id: game.id,
      code: game.code,
      players: game.players.map((player) => player.nick),
      gameState: game.state,
    };

    if (game.isStarted()) {
      Object.assign(result, {
        playState: game.playState,
        questionMaster: game.questionMaster.nick,
        question: {
          numberOfBlanks: game.question.numberOfBlanks,
          text: game.question.toString(),
        },
        answers: game.answers.map((answer) => answer.id),
        winner: game.winner?.nick,
      });
    }

    return result;
  }
}
