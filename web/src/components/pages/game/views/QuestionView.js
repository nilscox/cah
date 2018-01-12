import React from 'react';
import {connect} from 'react-redux';
import QuestionCard from '../../../common/QuestionCard';
import {submitAnswer} from '../../../../actions';

const all = arr => arr.indexOf(false) < 0;

const mapStateToProps = state => {
  const { game, player, selection } = state;
  const { question } = game;

  let choices = selection;

  if (player.submitted)
    choices = player.submitted.answers;

  return {
    questionMaster: game.question_master,
    question,
    choices,
    selectedIds: selection.map(choice => choice.id),
    submitted: !!player.submitted,
    canSubmitAnswer: all([
      game.state === 'started',
      game.question_master !== player.nick,
      !player.submitted,
      selection.length === question.nb_choices,
    ]),
  };
};

const mapDispatchToProps = dispatch => ({
  onSubmitAnswer: choiceIds => dispatch(submitAnswer(choiceIds)),
});

const QuestionView = ({ questionMaster, question, choices, selectedIds, submitted, canSubmitAnswer, onSubmitAnswer }) => (
  <div className="question-view">
    <div className={'question-card' + (canSubmitAnswer ? ' can-submit' : '') + (submitted ? ' submitted' : '')}>
      <QuestionCard question={question} choices={choices} onClick={() => canSubmitAnswer ? onSubmitAnswer(selectedIds) : null} />
      <div className="question-master">{questionMaster}</div>
    </div>
  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(QuestionView);