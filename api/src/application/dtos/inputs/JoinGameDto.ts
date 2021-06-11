import { IsString, Length } from 'class-validator';

export class JoinGameDto {
  @IsString()
  @Length(4, 4)
  code: string;

  constructor(data: any) {
    this.code = data.code;
  }
}