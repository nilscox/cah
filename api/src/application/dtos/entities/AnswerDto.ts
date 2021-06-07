import { Expose } from 'class-transformer';

import { Answer } from '../../../domain/entities/Answer';

import { ChoiceDto } from './ChoiceDto';

export class AnswerDto {
  @Expose()
  id: number;

  @Expose()
  player: string;

  @Expose()
  choices: ChoiceDto[];

  constructor(answer: Answer) {
    this.id = answer.id;
    this.player = answer.player.nick;
    this.choices = answer.choices.map((choice) => new ChoiceDto(choice));
  }
}
