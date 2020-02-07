import { ChoiceDTO } from './choice.dto';

export interface PlayerDTO {
  nick: string;
  connected: boolean;
  cards?: ChoiceDTO[];
  selection?: ChoiceDTO[];
}
