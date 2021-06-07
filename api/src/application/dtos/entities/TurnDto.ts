import { Expose, Type } from 'class-transformer';

import { Turn } from '../../../domain/entities/Turn';

import { AnswerDto } from './AnswerDto';
import { QuestionDto } from './QuestionDto';

export class TurnDto {
  @Expose()
  questionMaster: string;

  @Expose()
  @Type(() => QuestionDto)
  question: QuestionDto;

  @Expose()
  @Type(() => AnswerDto)
  answers: AnswerDto[];

  @Expose()
  winner: string;

  constructor(turn: Turn) {
    this.questionMaster = turn.questionMaster.nick;
    this.question = new QuestionDto(turn.question);
    this.answers = turn.answers.map((answer) => new AnswerDto(answer));
    this.winner = turn.winner!.nick;
  }
}
