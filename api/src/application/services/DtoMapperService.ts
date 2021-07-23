import { ChoiceDto, FullPlayerDto, GameDto, PlayerDto } from '../../../../shared/dtos';
import { PlayState } from '../../../../shared/enums';
import { Answer } from '../../domain/models/Answer';
import { Choice } from '../../domain/models/Choice';
import { Game } from '../../domain/models/Game';
import { Player } from '../../domain/models/Player';
import { RTCManager } from '../interfaces/RTCManager';

export class DtoMapperService {
  constructor(private readonly rtcManager: RTCManager) {}

  toChoiceDto(choice: Choice): ChoiceDto {
    return { text: choice.text };
  }

  toPlayerDto(player: Player): PlayerDto {
    const data = player.toJSON();

    return {
      id: data.id,
      nick: data.nick,
      isConnected: this.rtcManager.isConnected(player),
    };
  }

  toFullPlayerDto(player: Player): FullPlayerDto {
    const data = player.toJSON();

    return {
      id: data.id,
      gameId: data.gameId,
      nick: data.nick,
      isConnected: this.rtcManager.isConnected(player),
      cards: player.getCards().map((choice) => this.toChoiceDto(choice)),
    };
  }

  gameToDto(game: Game): GameDto {
    const result = {
      id: game.id,
      code: game.code,
      players: game.players.map((player) => this.toPlayerDto(player)),
      gameState: game.state,
    };

    if (!game.isStarted()) {
      return result;
    }

    let answers: Answer[] = [];

    if (game.playState !== PlayState.playersAnswer) {
      answers = game.answers;
    }

    return {
      ...result,
      playState: game.playState,
      questionMaster: game.questionMaster.nick,
      question: game.question.toJSON(),
      answers: answers.map((answer) => answer.toJSON(game.playState !== PlayState.endOfTurn)),
      winner: game.winner?.nick,
    };
  }
}
