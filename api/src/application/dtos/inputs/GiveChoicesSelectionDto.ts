import { IsInt, IsNotEmpty } from 'class-validator';

export class GiveChoicesSelectionDto {
  @IsInt({ each: true })
  @IsNotEmpty()
  choicesIds!: number[];
}
