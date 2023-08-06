import { ChoiceSlice } from '../choices/choices.slice';

import { QuestionSlice } from './questions.slice';

export type QuestionChunk = {
  text?: string;
  isBlank: boolean;
};

export function getQuestionChunks(question: QuestionSlice, choices: Array<ChoiceSlice | null> = []) {
  const { blanks, text } = question;
  const chunks: Array<QuestionChunk> = [];

  const getBlank = (index: number, toLowerCase = false): QuestionChunk => {
    const choice = choices?.[index];

    if (!choice) {
      return { isBlank: true };
    }

    if (toLowerCase && !choice.caseSensitive) {
      return {
        text: choice.text.toLowerCase(),
        isBlank: true,
      };
    }

    return {
      text: choice.text,
      isBlank: true,
    };
  };

  if (!blanks) {
    return [{ text, isBlank: false }, getBlank(0)];
  }

  let index = 0;

  for (const blank of blanks) {
    chunks.push({ text: text.slice(0, blank), isBlank: false });
    chunks.push(getBlank(index++, blank > 0));
  }

  chunks.push({ text: text.slice(blanks[blanks.length - 1]), isBlank: false });

  return chunks.filter(({ text }) => text !== '');
}