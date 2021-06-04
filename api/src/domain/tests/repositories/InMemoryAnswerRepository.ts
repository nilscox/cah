import { Answer } from '../../entities/Answer';
import { Choice } from '../../entities/Choice';
import { Player } from '../../entities/Player';
import { AnswerRepository } from '../../interfaces/AnswerRepository';

export class InMemoryAnswerRepository implements AnswerRepository {
  async createAnswer(player: Player, choices: Choice[]): Promise<Answer> {
    const answer = new Answer();

    answer.player = player;
    answer.choices = choices;

    return answer;
  }
}
