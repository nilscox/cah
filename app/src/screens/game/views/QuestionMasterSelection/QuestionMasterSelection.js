// @flow

import * as React from 'react';
import { View } from 'react-native';

import type { AnsweredQuestion } from '~/redux/state/answeredQuestion';

type QuestionMasterSelectionProps = {
  answers: Array<AnsweredQuestion>,
  canSelectAnsnwer: boolean,
};

const QusetionMasterSelection = ({ answers, canSelectAnsnwer }: QuestionMasterSelectionProps) => (
  <View />
);

export default QusetionMasterSelection;
