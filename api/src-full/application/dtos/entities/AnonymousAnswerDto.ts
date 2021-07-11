import { Expose } from 'class-transformer';

import { Answer } from '../../../domain/entities/Answer';

import { ChoiceDto } from './ChoiceDto';

export class AnonymousAnswerDto {
  @Expose()
  id: number;

  @Expose()
  choices: ChoiceDto[];

  constructor(answer: Answer) {
    this.id = answer.id;
    this.choices = answer.choices.map((choice) => new ChoiceDto(choice));
  }
}
