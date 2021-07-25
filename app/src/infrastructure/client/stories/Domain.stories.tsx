import React, { useState } from 'react';

import { Meta, Story } from '@storybook/react';

import { Choice } from '../../../domain/entities/Choice';
import { createQuestion } from '../../../tests/factories';
import { ChoiceCard, ChoiceCardProps } from '../components/domain/ChoiceCard';
import { ChoiceCardsListProps, ChoicesList } from '../components/domain/ChoicesList';
import { QuestionCard, QuestionCardProps } from '../components/domain/QuestionCard';

const createId = () => Math.random().toString(36).slice(-6);

const createChoice = (overrides: Partial<Choice>): Choice => ({
  id: createId(),
  text: 'text',
  ...overrides,
});

export default {
  title: 'Domain',
} as Meta;

type QuestionControls = {
  withChoices: boolean;
};

const QuestionTemplate: Story<QuestionCardProps & QuestionControls> = ({ question, choices, withChoices }) => (
  <QuestionCard question={question} choices={withChoices ? choices : []} />
);

QuestionTemplate.args = {
  withChoices: false,
};

export const questionCardNoChoices = QuestionTemplate.bind({});
questionCardNoChoices.args = {
  ...QuestionTemplate.args,
  question: createQuestion({ text: 'Qui es-tu ?' }),
  choices: [createChoice({ text: 'Gros con' })],
};

export const questionCardOneChoice = QuestionTemplate.bind({});
questionCardOneChoice.args = {
  ...QuestionTemplate.args,
  question: createQuestion({ text: 'A bientôt les  !', blanks: [14] }),
  choices: [createChoice({ text: 'Gros con' })],
};

export const questionCardThreeChoices = QuestionTemplate.bind({});
questionCardThreeChoices.args = {
  ...QuestionTemplate.args,
  question: createQuestion({ text: ' a plus de chances que  de  .', blanks: [0, 23, 28] }),
  choices: [
    createChoice({ text: 'Michel Drucker' }),
    createChoice({ text: 'Un ovni' }),
    createChoice({ text: 'Gagner aux échecs bourré' }),
  ],
};

const ChoiceTemplate: Story<ChoiceCardProps> = (props) => <ChoiceCard {...props} />;

export const choiceCard = ChoiceTemplate.bind({});
choiceCard.args = {
  choice: createChoice({ text: 'Alpha' }),
  selected: false,
};

const choices = [
  createChoice({ text: 'Bravo' }),
  createChoice({ text: 'Charlie' }),
  createChoice({ text: "S'étouffer avec une carrote cuite" }),
  createChoice({ text: "Un coussin d'air" }),
  createChoice({ text: 'Ta soeur' }),
  createChoice({ text: 'Conduire une grue sous LSD' }),
  createChoice({ text: 'Gros con' }),
  createChoice({ text: "Les chaussettes de l'archiduchesse" }),
  createChoice({ text: 'Aller au cinémas' }),
  createChoice({ text: 'Nicolas Sarkozy' }),
  createChoice({ text: 'La chasse aux sorcières' }),
];

const ChoicesListTemplate: Story<ChoiceCardsListProps> = ({ choices }) => {
  const [selection, setSelection] = useState<Choice[]>([]);

  const handleChoiceClick = (choice: Choice) => {
    const idx = selection.indexOf(choice);
    if (idx < 0) {
      setSelection([...selection, choice]);
    } else {
      setSelection([...selection.slice(0, idx), ...selection.slice(idx + 1)]);
    }
  };

  return <ChoicesList choices={choices} selection={selection} onChoiceClick={handleChoiceClick} />;
};

export const choicesList = ChoicesListTemplate.bind({});
choicesList.args = {
  choices,
};
