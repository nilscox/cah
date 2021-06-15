import { Choice } from '../../entities/Choice';
import { Game } from '../../entities/Game';
import { ChoiceRepository } from '../../interfaces/ChoiceRepository';

export class InMemoryChoiceRepository implements ChoiceRepository {
  private choices: Choice[] = [];

  setChoices(choices: Choice[]) {
    this.choices = choices;
  }

  async findAll(): Promise<Choice[]> {
    return this.choices;
  }

  async findByIds(ids: number[]): Promise<Choice[]> {
    return this.choices.filter(({ id }) => ids.includes(id));
  }

  async createChoices(_game: Game, choices: Choice[]): Promise<void> {
    this.choices = choices;
  }

  async getAvailableChoices(): Promise<Choice[]> {
    return [...this.choices];
  }
}
