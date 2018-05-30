// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';

import Button from './Button';

const noop = () => {};

it('should render a button', () => {
  const tree = renderer.create(<Button onPress={noop}>Button</Button>).toJSON();
  expect(tree).toMatchSnapshot();
});
