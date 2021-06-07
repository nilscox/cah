import { Answer } from '../../entities/Answer';
import { Choice } from '../../entities/Choice';
import { Player } from '../../entities/Player';
import { AnswerRepository } from '../../interfaces/AnswerRepository';

export class InMemoryAnswerRepository implements AnswerRepository {
  private answers: Answer[] = [];

  set(answers: Answer[]) {
    this.answers = answers;
  }

  async findOne(id: number): Promise<Answer | undefined> {
    return this.answers.find((answer) => answer.id === id);
  }

  async createAnswer(player: Player, choices: Choice[]): Promise<Answer> {
    const answer = new Answer();

    answer.player = player;
    answer.choices = choices;

    return answer;
  }
}
