import { ChoiceDTO } from './choice.dto';
import { AnswerDTO } from './answer.dto';

export interface PlayerDTO {
  nick: string;
  connected: boolean;
  cards?: ChoiceDTO[];
  selection?: ChoiceDTO[];
}
