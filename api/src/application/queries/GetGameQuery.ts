import { QueryHandler } from '../../ddd/QueryHandler';
import { GameState } from '../../domain/enums/GameState';
import { PlayState } from '../../domain/enums/PlayState';
import { RTCManager } from '../interfaces/RTCManager';
import { GameService } from '../services/GameService';

export class GetGameQuery {
  constructor(public readonly gameId: string) {}
}

export type GetGameResult = {
  id: string;
  code: string;
  players: Array<{
    id: string;
    gameId?: string;
    nick: string;
    isConnected: boolean;
  }>;
  gameState: GameState;
  playState?: PlayState;
  questionMaster?: string;
  question?: {
    text: string;
    blanks?: number[];
    numberOfBlanks: number;
    formatted: string;
  };
  answers?: Array<{
    id: string;
    player?: string;
    choices: string[];
    formatted: string;
  }>;
  winner?: string;
};

export class GetGameHandler implements QueryHandler<GetGameQuery, GetGameResult> {
  constructor(private readonly gameService: GameService, private readonly rtcManager: RTCManager) {}

  async execute({ gameId }: GetGameQuery) {
    const game = await this.gameService.getGame(gameId);

    const result = {
      id: game.id,
      code: game.code,
      players: game.players.map((player) => ({
        ...player.toJSON(),
        isConnected: this.rtcManager.isConnected(player),
      })),
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
