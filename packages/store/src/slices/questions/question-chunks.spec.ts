import { ChoicesSlice } from '../choices/choices.slice';

import { QuestionChunk, getQuestionChunks } from './question-chunks';
import { QuestionSlice } from './questions.slice';

describe('questionChunks', () => {
  const choice: ChoicesSlice = {
    id: '',
    text: 'Choice',
    caseSensitive: false,
  };

  const choiceCaseSensitive: ChoicesSlice = {
    id: '',
    text: 'Choice',
    caseSensitive: true,
  };

  const text = (text: string): QuestionChunk => ({
    text,
    isBlank: false,
  });

  const blank = (text?: string): QuestionChunk => ({
    text,
    isBlank: true,
  });

  describe('question with no blanks', () => {
    const question: QuestionSlice = {
      id: '',
      text: 'Question?',
    };

    test('no choice', () => {
      expect(getQuestionChunks(question)).toEqual([text('Question? '), blank()]);
    });

    test('with choice', () => {
      expect(getQuestionChunks(question, [choice])).toEqual([text('Question? '), blank('Choice')]);
    });

    test('with case sensitive choice', () => {
      expect(getQuestionChunks(question, [choiceCaseSensitive])).toEqual([
        text('Question? '),
        blank('Choice'),
      ]);
    });
  });

  describe('question starting with a blank', () => {
    const question: QuestionSlice = {
      id: '',
      text: ', yes!',
      blanks: [0],
    };

    test('no choice', () => {
      expect(getQuestionChunks(question)).toEqual([blank(), text(', yes!')]);
    });

    test('with choice', () => {
      expect(getQuestionChunks(question, [choice])).toEqual([blank('Choice'), text(', yes!')]);
    });

    test('with case sensitive choice', () => {
      expect(getQuestionChunks(question, [choiceCaseSensitive])).toEqual([blank('Choice'), text(', yes!')]);
    });
  });

  describe('question with a blank in the middle', () => {
    const question: QuestionSlice = {
      id: '',
      text: 'I am .',
      blanks: [5],
    };

    test('no choice', () => {
      expect(getQuestionChunks(question)).toEqual([text('I am '), blank(), text('.')]);
    });

    test('with choice', () => {
      expect(getQuestionChunks(question, [choice])).toEqual([text('I am '), blank('choice'), text('.')]);
    });

    test('with case sensitive choice', () => {
      expect(getQuestionChunks(question, [choiceCaseSensitive])).toEqual([
        text('I am '),
        blank('Choice'),
        text('.'),
      ]);
    });
  });
});
