import { Expose } from 'class-transformer';

import { Choice } from '../../../domain/entities/Choice';

export class ChoiceDto {
  @Expose()
  text: string;

  constructor(choice: Choice) {
    this.text = choice.text;
  }
}
