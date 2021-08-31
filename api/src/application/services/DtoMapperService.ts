import { Answer } from '../../domain/models/Answer';
import { Choice } from '../../domain/models/Choice';
import { Game } from '../../domain/models/Game';
import { Player } from '../../domain/models/Player';
import { Question } from '../../domain/models/Question';
import { Turn } from '../../domain/models/Turn';
import {
  AnswerDto,
  ChoiceDto,
  FullPlayerDto,
  GameDto,
  PlayerDto,
  QuestionDto,
  StartedGameDto,
  TurnDto,
} from '../../shared/dtos';
import { PlayState } from '../../shared/enums';
import { GameRepository } from '../interfaces/GameRepository';
import { RTCManager } from '../interfaces/RTCManager';

export class DtoMapperService {
  constructor(private readonly gameRepository: GameRepository, private readonly rtcManager: RTCManager) {}

  toChoiceDto = (choice: Choice): ChoiceDto => {
    return choice.toJSON();
  };

  toQuestionDto = (question: Question): QuestionDto => {
    return question.toJSON();
  };

  toAnswerDto = (answer: Answer, anonymous = false): AnswerDto => {
    const { player, ...dto } = answer.toJSON(anonymous);

    if (!player) {
      return dto;
    }

    return {
      ...dto,
      player: player.id,
    };
  };

  toPlayerDto = (player: Player): PlayerDto => {
    const { id, nick } = player.toJSON();

    return {
      id,
      nick,
      isConnected: this.rtcManager.isConnected(player),
    };
  };

  toFullPlayerDto = (player: Player): FullPlayerDto => {
    const { gameId } = player.toJSON();

    return {
      ...this.toPlayerDto(player),
      gameId,
      cards: player.cards.map(this.toChoiceDto),
      hasFlushed: player.hasFlushed,
    };
  };

  gameToDto = async (game: Game): Promise<GameDto | StartedGameDto> => {
    const result: GameDto = {
      id: game.id,
      code: game.code,
      creator: game.creator.id,
      players: game.players.map(this.toPlayerDto),
      gameState: game.state,
    };

    if (!game.isStarted()) {
      return result;
    }

    const getAnswers = (): AnswerDto[] => {
      if (game.playState === PlayState.playersAnswer) {
        return [];
      }

      const anonymous = game.playState !== PlayState.endOfTurn;

      return game.answers.map((answer) => this.toAnswerDto(answer, anonymous));
    };

    return {
      ...result,
      playState: game.playState,
      totalQuestions: await this.gameRepository.getQuestionsCount(game.id),
      questionMaster: game.questionMaster.id,
      question: this.toQuestionDto(game.question),
      answers: getAnswers(),
      winner: game.winner?.id,
    } as StartedGameDto;
  };

  turnToDto = (turn: Turn, index: number): TurnDto => {
    return {
      id: turn.id,
      number: index + 1,
      questionMaster: turn.questionMaster.id,
      question: this.toQuestionDto(turn.question),
      answers: turn.answers.map((answer) => this.toAnswerDto(answer)),
      winner: turn.winner.id,
    };
  };
}
