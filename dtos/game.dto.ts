import { PlayerDTO } from './player.dto';
import { QuestionDTO } from './question.dto';
import { TurnDTO } from './turn.dto';
import { ChoiceDTO } from './choice.dto';

export interface GameDTO {
  id: string;
  state: 'idle' | 'started' | 'finished';
  players: PlayerDTO[];
  playState?: 'players_answer' | 'question_master_selection';
  questionMaster?: string;
  question?: QuestionDTO;
  answered?: string[];
  answers?: ChoiceDTO[][];
  turn?: number;
  turns?: TurnDTO[];
  scores?: { [player: string]: number };
}
