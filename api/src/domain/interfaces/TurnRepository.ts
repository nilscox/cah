import { Token } from 'typedi';

import { Answer } from '../entities/Answer';
import { Game } from '../entities/Game';
import { Player } from '../entities/Player';
import { Question } from '../entities/Question';
import { Turn } from '../entities/Turn';

export const TurnRepositoryToken = new Token('TurnRepository');

export interface TurnRepository {
  createTurn(game: Game, questionMaster: Player, question: Question, answers: Answer[], winner: Player): Promise<Turn>;
}