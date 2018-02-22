// @flow

import React from 'react';
import { connect } from 'react-redux';

import type { State } from '../../../../types/state';
import type { QuestionType, ChoiceType } from '../../../../types/models';
import { toClassName } from '../../../../utils';
import { submitAnswer } from '../../../../actions/game';

import QuestionCard from '../../../common/QuestionCard';

const all: Array<boolean> => boolean = arr => arr.indexOf(false) < 0;

type QuestionViewStateProps = {|
  questionMaster: string,
  question: QuestionType,
  choices: Array<ChoiceType>,
  submitted: boolean,
  canSubmitAnswer: boolean,
|};

type QuestionViewDispatchProps = {|
  onSubmitAnswer: () => void,
|};

type QuestionViewProps =
  & QuestionViewStateProps
  & QuestionViewDispatchProps;

const mapStateToProps: State => QuestionViewStateProps = ({
  game,
  player,
  selection,
}) => {
  const { question } = game;

  let choices = selection;

  if (player.submitted)
    choices = player.submitted.answers;

  return {
    questionMaster: game.question_master,
    question,
    choices,
    submitted: !!player.submitted,
    canSubmitAnswer: all([
      game.state === 'started',
      game.question_master !== player.nick,
      !player.submitted,
      selection.length === question.nb_choices,
    ]),
  };
};

const mapDispatchToProps: any => QuestionViewDispatchProps = dispatch => ({
  onSubmitAnswer: () => dispatch(submitAnswer()),
});

const QuestionView = ({
  questionMaster,
  question,
  choices,
  submitted,
  canSubmitAnswer,
  onSubmitAnswer,
}: QuestionViewProps) => (
  <div className="game-view" id="question-view">

    <div className={toClassName([
      'question-card',
      canSubmitAnswer && 'can-submit',
      submitted && 'submitted'
    ])}>

      <QuestionCard
        question={question}
        choices={choices}
        className={toClassName([!submitted && 'underline'])}
        onClick={() => canSubmitAnswer ? onSubmitAnswer() : undefined} />

      <div className="question-master">{questionMaster}</div>

    </div>

  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(QuestionView);
