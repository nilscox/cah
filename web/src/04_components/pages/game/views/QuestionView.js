// @flow

import * as React from 'react';
import { connect } from 'react-redux';

import type { Dispatch, Action } from '../../../../types/actions';
import type { State } from '../../../../types/state';
import type { QuestionType, ChoiceType } from '../../../../types/models';
import { toClassName } from '../../../../utils';
import { submitAnswer } from '../../../../actions/game';

import QuestionCard from '../../../common/QuestionCard';

const all: Array<boolean> => boolean = arr => arr.indexOf(false) < 0;

type QuestionViewStateProps = {|
  questionMaster: string,
  question: QuestionType,
  selectedChoices: Array<ChoiceType>,
  submitted: boolean,
  canSubmitAnswer: boolean,
|};

type QuestionViewDispatchProps = {|
  onSubmitAnswer: Array<ChoiceType> => Action,
|};

type QuestionViewProps =
  & QuestionViewStateProps
  & QuestionViewDispatchProps;

const mapStateToProps: State => QuestionViewStateProps = ({
  game,
  player,
}) => {
  const { question } = game;

  let selectedChoices = player.selection;

  if (player.submitted)
    selectedChoices = player.submitted.answers;

  return {
    questionMaster: game.question_master,
    question,
    selectedChoices,
    submitted: !!player.submitted,
    canSubmitAnswer: all([
      game.state === 'started',
      game.question_master !== player.nick,
      !player.submitted,
      player.selection.length === question.nb_choices,
    ]),
  };
};

const mapDispatchToProps: Dispatch => QuestionViewDispatchProps = dispatch => ({
  onSubmitAnswer: choices => dispatch(submitAnswer(choices.map(choice => choice.id))),
});

const QuestionView = ({
  questionMaster,
  question,
  selectedChoices,
  submitted,
  canSubmitAnswer,
  onSubmitAnswer,
}: QuestionViewProps) => {
  const onCardClicked = () => {
    if (canSubmitAnswer)
      onSubmitAnswer(selectedChoices);
  };

  return (
    <div className="game-view" id="question-view">

      <div className={toClassName([
        'question-card',
        canSubmitAnswer && 'can-submit',
        submitted && 'submitted'
      ])}>

        <QuestionCard
          question={question}
          choices={selectedChoices}
          // TODO: delete?
          className={toClassName([!submitted && 'underline'])}
          onClick={onCardClicked} />

        <div className="question-master">{questionMaster}</div>

      </div>

    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionView);
