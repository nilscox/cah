import { Expose, Type } from 'class-transformer';

import { TurnStarted } from '../../../domain/interfaces/GameEvents';
import { QuestionDto } from '../entities/QuestionDto';

export class TurnStartedDto {
  @Expose()
  type: string;

  @Expose()
  questionMaster: string;

  @Expose()
  @Type(() => QuestionDto)
  question: QuestionDto;

  constructor(event: TurnStarted) {
    this.type = event.type;
    this.questionMaster = event.questionMaster.nick;
    this.question = new QuestionDto(event.question);
  }
}
