import { Expose } from 'class-transformer';

import { Question } from '../../../domain/entities/Question';

export class QuestionDto {
  @Expose()
  text: string;

  @Expose()
  neededChoices: number;

  constructor(question: Question) {
    this.text = question.text;
    this.neededChoices = question.neededChoices;
  }
}
