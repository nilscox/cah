// @flow

import * as React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import type { Player } from '~/redux/state/player';
import type { AnsweredQuestion } from '~/redux/state/answeredQuestion';
import { selectAnswer } from '~/redux/actions';
import selectors from '~/redux/selectors';
import PlayerAvatar from '~/components/PlayerAvatar';
import AnsweredQuestionsList from '~/components/AnsweredQuestionsList'

import styles from './QuestionMasterSelection.styles';

type QuestionMasterSelectionProps = {
  questionMaster: Player,
  propositions: Array<AnsweredQuestion>,
  canSelectAnswer: boolean,
  selectAnswer: Function,
};

const mapStateToProps = (state) => ({
  questionMaster: selectors.gameQuestionMaster(state),
  propositions: selectors.gamePropositions(state),
  canSelectAnswer: selectors.gameCanSelectAnswer(state),
});

const mapDispatchToProps = (dispatch: Function) => ({
  selectAnswer: (answer) => dispatch(selectAnswer(answer)),
});

const QuestionMasterSelection = ({
  questionMaster,
  propositions,
  canSelectAnswer,
  selectAnswer,
}: QuestionMasterSelectionProps) => (
  <View style={styles.wrapper}>

    <PlayerAvatar
      style={styles.questionMaster}
      player={questionMaster}
      size="big"
      showNick
    />

    <AnsweredQuestionsList
      answers={propositions}
      onSelectAnswer={(answer) => canSelectAnswer && selectAnswer(answer)}
    />

  </View>
);

export default connect(mapStateToProps, mapDispatchToProps)(QuestionMasterSelection);
