import { PlayState } from '../../domain/enums/PlayState';
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

    if (!game.isStarted()) {
      return result;
    }

    return {
      ...result,
      playState: game.playState,
      questionMaster: game.questionMaster.nick,
      question: game.question.toJSON(),
      answers: game.answers.map((answer) => answer.toJSON(game.playState !== PlayState.endOfTurn)),
      winner: game.winner?.nick,
    };
  }
}
