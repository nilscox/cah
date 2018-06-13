// @flow

import type { Choice } from '../state/choice';
import type { AnsweredQuestion } from '../state/answeredQuestion';

export const TOGGLE_CHOICE = 'TOGGLE_CHOICE';
export const toggleChoice = (choice: Choice) => ({
  type: TOGGLE_CHOICE,
  choice,
});

export const SUBMIT_ANSWER = 'SUBMIT_ANSWER';
export const submitAnswer = () => (dispatch: Function, getState: Function) => {
  const { player } = getState();
  const { selectedChoices: choices } = player;

  dispatch({
    type: SUBMIT_ANSWER,
    route: `/api/answer`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids: choices.map(c => c.id) }),
  });
};

export const SELECT_ANSWER = 'SELECT_ANSWER';
export const selectAnswer = (answer: AnsweredQuestion) => ({
  type: SELECT_ANSWER,
  route: `/api/answer/select/${answer.id}`,
  method: 'POST',
});
