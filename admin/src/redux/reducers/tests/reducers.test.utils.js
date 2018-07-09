import { KEY } from 'redux-pack';
import { expect } from 'chai';
import crio from 'crio';

export const packAction = (lifecycle, { type, payload, meta={} }) => ({
  type,
  payload,
  meta: {
    ...meta,
    [KEY.LIFECYCLE]: lifecycle,
  },
});

export const wsAction = (message) => ({
  type: 'WS_MESSAGE',
  message,
});

export const test = (reducer, preActions, action, expected) => {
  const state = [ undefined, {}, ...preActions ].reduce((state, action) => reducer(state, action));
  const expectedValue = crio(expected(state)).thaw();

  expect(reducer(state, action).thaw()).to.deep.equal(expectedValue);
};