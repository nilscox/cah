import { Turn } from '../../entities/Turn';
import { TurnRepository } from '../../interfaces/TurnRepository';

export class InMemoryTurnRepository implements TurnRepository {
  private turns: Turn[] = [];

  get() {
    return this.turns;
  }

  async save(turn: Turn): Promise<void> {
    if (this.turns[turn.id]) {
      this.turns[turn.id] = turn;
    } else {
      // TODO: don't mutate the turn instance
      turn.id = this.turns.length;
      this.turns.push(turn);
    }
  }
}
