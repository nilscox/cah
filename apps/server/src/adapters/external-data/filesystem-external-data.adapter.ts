import fs from 'node:fs/promises';
import path from 'node:path';

import { injectableClass } from 'ditox';

import { TOKENS } from 'src/tokens';

import { ConfigPort } from '../config/config.port';
import { RandomPort } from '../random/random.port';

import { ChoiceData, ExternalDataPort, QuestionData } from './external-data.port';

export class FilesystemExternalDataAdapter implements ExternalDataPort {
  static inject = injectableClass(this, TOKENS.config, TOKENS.random);

  constructor(
    private readonly config: ConfigPort,
    private readonly random: RandomPort,
  ) {}

  async getQuestions(count: number): Promise<QuestionData[]> {
    type Data = { text: string; blanks?: number[] };
    const data = await this.loadJsonFile<Array<Data>>(path.join('fr', 'questions.json'));
    const questions: QuestionData[] = data;

    return this.random.randomize(questions).slice(0, count);
  }

  async getChoices(count: number): Promise<ChoiceData[]> {
    type Data = { text: string; caseSensitive?: boolean };
    const data = await this.loadJsonFile<Array<Data>>(path.join('fr', 'choices.json'));
    const choices: ChoiceData[] = data.map(({ text, caseSensitive = false }) => ({ text, caseSensitive }));

    return this.random.randomize(choices).slice(0, count);
  }

  private async loadJsonFile<T>(filepath: string): Promise<T> {
    const content = await fs.readFile(path.join(this.config.data.path, filepath));

    return JSON.parse(content.toString()) as T;
  }
}
