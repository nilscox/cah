import { IsInt, IsPositive } from 'class-validator';

export class PickWinningAnswerDto {
  @IsInt()
  @IsPositive()
  answerId!: number;
}
