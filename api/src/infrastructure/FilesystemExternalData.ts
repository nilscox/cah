import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import { RandomService } from '../application/services/RandomService';
import { ExternalData } from '../domain/interfaces/ExternalData';
import { Blank } from '../domain/models/Blank';
import { Choice } from '../domain/models/Choice';
import { Question } from '../domain/models/Question';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Data = any;

export class FilesystemExternalData implements ExternalData {
  constructor(private readonly dataDir: string, private readonly randomService: RandomService) {}

  async pickRandomQuestions(count: number): Promise<Question[]> {
    const data = await this.loadJsonFile('fr', 'questions.json');
    const questions: Question[] = data.map(
      (data: Data) =>
        new Question(
          data.text,
          data.blanks?.map((place: number) => new Blank(place)),
        ),
    );

    return this.randomService.randomize(questions).slice(0, count);
  }

  async pickRandomChoices(count: number): Promise<Choice[]> {
    const data = await this.loadJsonFile('fr', 'choices.json');
    const choices: Choice[] = data.map((data: Data) => new Choice(data.text));

    return this.randomService.randomize(choices).slice(0, count);
  }

  private async loadJsonFile(language: string, file: string) {
    const content = await promisify(fs.readFile)(path.join(this.dataDir, language, file));
    return JSON.parse(String(content));
  }
}
