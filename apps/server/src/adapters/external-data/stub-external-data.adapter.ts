import { array } from '@cah/utils';

import { type ChoiceData, type ExternalDataPort, type QuestionData } from './external-data.port.ts';

export class StubExternalDataAdapter implements ExternalDataPort {
  questions?: QuestionData[];

  async getQuestions(count: number): Promise<QuestionData[]> {
    if (this.questions) {
      return this.questions;
    }

    return array(count, (index) => ({
      id: `questionId${index + 1}`,
      text: `Question ${index + 1}.`,
      numberOfBlanks: 0,
    }));
  }

  async getChoices(count: number): Promise<ChoiceData[]> {
    return array(count, (index) => ({
      id: `choiceId${index + 1}`,
      text: `Choice ${index + 1}.`,
      caseSensitive: false,
    }));
  }
}
