import React, { useEffect, useState } from 'react';

import { action } from '@storybook/addon-actions';
import { Meta } from '@storybook/react';

import Button from '../components/elements/Button';
import { Input } from '../components/elements/Input';
import SubmittableInput from '../components/elements/SubmittableInput';
import { Center } from '../components/layout/Center';
import { FullScreen } from '../components/layout/FullScreen';

export default {
  title: 'Form',
  decorators: [
    (Story) => (
      <FullScreen>
        <Center padding={4}>
          <Story />
        </Center>
      </FullScreen>
    ),
  ],
} as Meta;

export const ButtonStory = () => <Button onClick={action('click')}>Click me!</Button>;

ButtonStory.storyName = 'Button';

/* eslint-disable react-hooks/rules-of-hooks */

export const input = () => {
  const [value, setValue] = useState('');

  useEffect(() => {
    action('change')(value);
  });

  return <Input placeholder="Type something..." value={value} onTextChange={setValue} />;
};

export const submittableInput = () => {
  const [value, setValue] = useState('');

  useEffect(() => {
    action('change')(value);
  });

  return (
    <SubmittableInput
      placeholder="Type and submit..."
      value={value}
      onTextChange={setValue}
      onSubmit={action('submit')}
    />
  );
};
