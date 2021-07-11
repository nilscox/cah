import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import { Inject, Service } from 'typedi';

import { Choice } from '../domain/entities/Choice';
import { Question } from '../domain/entities/Question';
import { ExternalData } from '../domain/interfaces/ExternalData';
import { RandomService } from '../domain/services/RandomService';

@Service()
export class FilesystemExternalData implements ExternalData {
  @Inject('DATA_DIR')
  private readonly dataDir!: string;

  @Inject()
  private readonly randomService!: RandomService;

  async pickRandomQuestions(count: number): Promise<Question[]> {
    const data = await this.loadJsonFile('fr', 'questions.json');
    const questions: Question[] = data.map((data: unknown) => Object.assign(new Question(), data));

    return this.randomService.randomize(questions).slice(0, count);
  }

  async pickRandomChoices(count: number): Promise<Choice[]> {
    const data = await this.loadJsonFile('fr', 'choices.json');
    const choices: Choice[] = data.map((data: unknown) => Object.assign(new Choice(), data));

    return this.randomService.randomize(choices).slice(0, count);
  }

  private loadJsonFile(language: string, file: string) {
    const content = promisify(fs.readFile)(path.join(this.dataDir, language, file));
    return JSON.parse(String(content));
  }
}
