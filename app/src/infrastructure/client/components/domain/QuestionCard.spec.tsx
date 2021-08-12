import React from 'react';

import { ThemeProvider } from '@emotion/react';
import { render, screen } from '@testing-library/react';
import expect from 'expect';

import { createChoice, createChoices, createQuestion } from '../../../../tests/factories';
import { theme } from '../../styles/theme';

import { QuestionCard, QuestionCardProps } from './QuestionCard';

const Test: React.FC = ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>;

describe('QuestionCard', () => {
  const props: QuestionCardProps = {
    question: createQuestion(),
    choices: [],
  };

  const renderQuestionCard = (overrides: Partial<QuestionCardProps>) => {
    const { container } = render(
      <Test>
        <QuestionCard {...props} {...overrides} />
      </Test>,
    );

    return container.textContent;
  };

  it('renders a question without blanks and without choices', () => {
    const question = createQuestion({ text: 'Hello.' });

    renderQuestionCard({ question });

    expect(screen.getByText('Hello.')).toBeDefined();
  });

  it('renders a question with blanks and without choices', () => {
    const question = createQuestion({ text: 'Hello .', blanks: [6] });

    const text = renderQuestionCard({ question });

    expect(text).toEqual('Hello .');
  });

  it('renders a question without blanks and with a choice', () => {
    const question = createQuestion({ text: 'Hello.' });
    const choice = createChoice({ text: 'You' });

    const text = renderQuestionCard({ question, choices: [choice] });

    expect(text).toEqual('Hello. You');
  });

  it('renders a question with blanks and with choices', () => {
    const question = createQuestion({ text: 'Hello . Do you like ?', blanks: [6, 20] });
    const choices = createChoices(2, { text: ['You', 'Me'] });

    const text = renderQuestionCard({ question, choices });

    expect(text).toEqual('Hello you. Do you like me?');
  });
});
