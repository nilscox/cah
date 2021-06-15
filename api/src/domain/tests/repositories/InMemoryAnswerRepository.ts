import { Answer } from '../../entities/Answer';
import { Game } from '../../entities/Game';
import { AnswerRepository } from '../../interfaces/AnswerRepository';

export class InMemoryAnswerRepository implements AnswerRepository {
  private answers: Answer[] = [];
  private gameAnswers: Record<number, Answer[]> = {};

  setAnswers(answers: Answer[]) {
    this.answers = answers;
  }

  async findAll(): Promise<Answer[]> {
    return this.answers;
  }

  async findOne(id: number): Promise<Answer | undefined> {
    return this.answers.find((answer) => answer.id === id);
  }

  async save(answer: Answer): Promise<void> {
    if (this.answers[answer.id]) {
      this.answers[answer.id] = answer;
    } else {
      answer.id = this.answers.length;
      this.answers.push(answer);
    }
  }

  async saveAll(answers: Answer[]): Promise<void> {
    for (const answer of answers) {
      this.save(answer);
    }
  }

  async setGame(answer: Answer, game: Game): Promise<void> {
    const answers = await this.findForGame(game);

    this.gameAnswers[game.id] = [...answers, answer];
  }

  async findForGame(game: Game): Promise<Answer[]> {
    return this.sort(this.gameAnswers[game.id] ?? []);
  }

  private sort(answers: Answer[]): Answer[] {
    return answers.sort(({ place: a }, { place: b }) => (b ?? 0) - (a ?? 0));
  }
}
