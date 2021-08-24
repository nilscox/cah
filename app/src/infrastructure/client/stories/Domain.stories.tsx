import React, { useState } from 'react';

import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/react';

import { Choice } from '../../../domain/entities/Choice';
import { createQuestion } from '../../../tests/factories';
import { ChoiceCard, ChoiceCardProps } from '../components/domain/ChoiceCard';
import { ChoiceCardsListProps, ChoicesList } from '../components/domain/ChoicesList';
import { Fallback } from '../components/domain/ErrorBoundary';
import Header, { HeaderProps, HeaderRightText } from '../components/domain/Header';
import { Notification } from '../components/domain/Notification';
import { QuestionCard, QuestionCardProps } from '../components/domain/QuestionCard';
import { Fireworks } from '../components/elements/Fireworks';
import { Icon } from '../components/elements/Icon';
import { IconButton } from '../components/elements/IconButton';
import Menu from '../icons/menu.svg';

import { choices } from './fixtures';

const createId = () => Math.random().toString(36).slice(-6);

const createChoice = (overrides: Partial<Choice>): Choice => ({
  id: createId(),
  text: 'text',
  caseSensitive: false,
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

  return (
    <ChoicesList
      choices={choices}
      selection={selection}
      onChoiceClick={handleChoiceClick}
      onOrderChange={action('order change')}
    />
  );
};

export const choicesList = ChoicesListTemplate.bind({});
choicesList.args = {
  choices,
};

// const notificationText = 'Regardez !';
const notificationText = 'Regardez, je suis une magnifique notification !';

export const notification = () => <Notification text={notificationText} />;

export const header: Story<HeaderProps & { showNotification: boolean }> = ({ showNotification, ...props }) => (
  <Header
    notification={showNotification ? notificationText : undefined}
    {...props}
    left={
      <IconButton>
        <Icon as={Menu} />
      </IconButton>
    }
    right={<HeaderRightText>good guy</HeaderRightText>}
  />
);

header.args = {
  showNotification: false,
  title: 'The Title',
};

export const fireworks = () => <Fireworks />;

export const errorBoundary = () => <Fallback />;
