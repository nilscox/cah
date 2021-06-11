import { IsInt, IsPositive } from 'class-validator';

export class StartGameDto {
  @IsInt()
  @IsPositive()
  numberOfTurns: number;

  constructor(data: any) {
    this.numberOfTurns = data.numberOfTurns;
  }
}
