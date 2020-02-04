import { ChoiceDTO } from './choice.dto';

export interface AnswerDTO {
  player: string;
  choices: ChoiceDTO[];
}
