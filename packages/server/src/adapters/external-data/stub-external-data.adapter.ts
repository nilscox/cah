import { Question } from 'src/entities';
import { array } from 'src/utils/array';

import { ChoiceData, ExternalDataPort, QuestionData } from './external-data.port';

export class StubExternalDataAdapter implements ExternalDataPort {
  questions?: Question[];

  async getQuestions(count: number): Promise<QuestionData[]> {
    if (this.questions) {
      return this.questions;
    }

    return array(count, (index) => ({
      id: `question${index + 1}Id`,
      text: `Question ${index + 1}.`,
      numberOfBlanks: 0,
    }));
  }

  async getChoices(count: number): Promise<ChoiceData[]> {
    return array(count, (index) => ({
      id: `choice${index + 1}Id`,
      text: `Choice ${index + 1}.`,
      caseSensitive: false,
    }));
  }
}
