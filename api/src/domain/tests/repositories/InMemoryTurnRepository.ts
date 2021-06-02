import { Answer } from '../../entities/Answer';
import { Game } from '../../entities/Game';
import { Player } from '../../entities/Player';
import { Question } from '../../entities/Question';
import { Turn } from '../../entities/Turn';
import { TurnRepository } from '../../interfaces/TurnRepository';

export class InMemoryTurnRepository implements TurnRepository {
  private turns: Turn[] = [];

  async createTurn(
    _game: Game,
    questionMaster: Player,
    question: Question,
    answers: Answer[],
    winner: Player,
  ): Promise<Turn> {
    const turn = new Turn();

    turn.questionMaster = questionMaster;
    turn.question = question;
    turn.answers = answers;
    turn.winner = winner;

    this.turns.push(turn);

    return turn;
  }

  getTurns() {
    return this.turns;
  }

  clear() {
    this.turns = [];
  }
}
