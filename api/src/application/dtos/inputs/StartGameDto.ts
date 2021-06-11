import { IsInt, IsPositive } from 'class-validator';

export class StartGameDto {
  @IsInt()
  @IsPositive()
  numberOfTurns!: number;
}
