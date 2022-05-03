import { GameDto } from '../../../../shared/dtos';
import { arrayToObject } from '../../shared/arrayToObject';
import { Game } from '../entities/game';

export const gameDtoToEntity = (gameDto: GameDto): Game => ({
  id: gameDto.id,
  creator: gameDto.creator,
  code: gameDto.code,
  state: gameDto.gameState,
  players: arrayToObject(gameDto.players),
  turns: [],
});
