import { Choice, Question } from '@cah/shared';

import { QuestionChunk, getQuestionChunks } from './question-chunks';

describe('questionChunks', () => {
  const choice: Choice = {
    id: '',
    text: 'Choice',
    caseSensitive: false,
  };

  const choiceCaseSensitive: Choice = {
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
    const question: Question = {
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
    const question: Question = {
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
    const question: Question = {
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

  describe('question with multiple blanks in the middle', () => {
    const question: Question = {
      id: '',
      text: 'I am , not .',
      blanks: [5, 11],
    };

    test('no choice', () => {
      expect(getQuestionChunks(question)).toEqual([
        text('I am '),
        blank(),
        text(', not '),
        blank(),
        text('.'),
      ]);
    });

    test('with a choice', () => {
      expect(getQuestionChunks(question, [choice, null])).toEqual([
        text('I am '),
        blank('choice'),
        text(', not '),
        blank(),
        text('.'),
      ]);
    });
  });
});
