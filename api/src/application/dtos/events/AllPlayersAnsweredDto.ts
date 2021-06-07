import { Expose, Type } from 'class-transformer';

import { AllPlayersAnswered } from '../../../domain/interfaces/GameEvents';
import { AnonymousAnswerDto } from '../entities/AnonymousAnswerDto';

export class AllPlayersAnsweredDto {
  @Expose()
  type: string;

  @Expose()
  @Type(() => AnonymousAnswerDto)
  answers: AnonymousAnswerDto[];

  constructor(event: AllPlayersAnswered) {
    this.type = event.type;
    this.answers = event.answers.map((answer) => new AnonymousAnswerDto(answer));
  }
}
