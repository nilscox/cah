import { Expose, Type } from 'class-transformer';

import { WinnerSelected } from '../../../domain/interfaces/GameEvents';
import { AnswerDto } from '../entities/AnswerDto';

export class WinnerSelectedDto {
  @Expose()
  type: string;

  @Expose()
  winner: string;

  @Expose()
  @Type(() => AnswerDto)
  answers: AnswerDto[];

  constructor(event: WinnerSelected) {
    this.type = event.type;
    this.winner = event.winner.nick;
    this.answers = event.answers.map((answer) => new AnswerDto(answer));
  }
}
