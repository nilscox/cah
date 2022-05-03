import { TurnDto } from '../../../../shared/dtos';
import { Answer } from '../entities/Answer';
import { Turn } from '../entities/Turn';

export const turnDtoToEntity = (turnDto: TurnDto): Turn => ({
  number: turnDto.number,
  question: turnDto.question,
  winner: turnDto.winner,
  answers: turnDto.answers as Answer[],
});
