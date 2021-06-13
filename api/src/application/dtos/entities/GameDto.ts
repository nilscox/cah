import { Expose, Type } from 'class-transformer';

import { Game, GameState, PlayState } from '../../../domain/entities/Game';

import { PlayerDto } from './PlayerDto';
import { QuestionDto } from './QuestionDto';

export class GameDto {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  @Type(() => PlayerDto)
  players: PlayerDto[];

  @Expose()
  state: GameState;

  constructor(game: Game) {
    this.id = game.id;
    this.code = game.code;
    this.players = game.players.map((player) => new PlayerDto(player));
    this.state = game.state;
  }
}

export class StartedGameDto extends GameDto {
  @Expose()
  playState: PlayState;

  @Expose()
  @Type(() => PlayerDto)
  questionMaster: PlayerDto;

  @Expose()
  @Type(() => QuestionDto)
  question: QuestionDto;

  constructor(game: Game) {
    super(game);

    this.playState = game.playState!;
    this.questionMaster = new PlayerDto(game.questionMaster!);
    this.question = new QuestionDto(game.question!);
  }
}
