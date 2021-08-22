import React, { useEffect, useState } from 'react';

import { action } from '@storybook/addon-actions';
import { Meta } from '@storybook/react';

import Button from '../components/elements/Button';
import { Input } from '../components/elements/Input';
import { Select } from '../components/elements/Select';
import SubmittableInput from '../components/elements/SubmittableInput';
import TypedLabel from '../components/elements/TypedLabel';
import { Center } from '../components/layout/Center';
import { FullScreen } from '../components/layout/FullScreen';

export default {
  title: 'Elements',
  decorators: [
    (Story) => (
      <FullScreen>
        <Center flex={1} padding={4}>
          <Story />
        </Center>
      </FullScreen>
    ),
  ],
} as Meta;

export const button = () => <Button onClick={action('click')}>Click me!</Button>;

/* eslint-disable react-hooks/rules-of-hooks */

export const input = () => {
  const [value, setValue] = useState('');

  useEffect(() => {
    action('change')(value);
  });

  return <Input placeholder="Type something..." value={value} onTextChange={setValue} />;
};

export const select = () => {
  const [value, setValue] = useState('');

  useEffect(() => {
    action('change')(value);
  });

  return (
    <Select value={value} onChange={(e) => setValue(e.target.value)}>
      <option>Mano</option>
      <option>Raspout</option>
      <option>Eugène</option>
      <option>Sacha</option>
    </Select>
  );
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

export const typedLabel = () => <TypedLabel>Allez salut les toons !</TypedLabel>;
