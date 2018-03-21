// @flow

import * as React from 'react';
import { connect } from 'react-redux';

import type { Dispatch, Action } from 'Types/actions';
import type { State } from 'Types/state';
import type { QuestionType, ChoiceType } from 'Types/models';
import { toClassName } from '../../../../utils';
import { submitAnswer } from 'Actions/game';

import QuestionCard from '../../../common/QuestionCard';

const all: Array<boolean> => boolean = arr => arr.indexOf(false) < 0;

type QuestionViewStateProps = {|
  questionMaster: string,
  question: QuestionType,
  selectedChoices: Array<ChoiceType>,
  submitted: boolean,
  canSubmitAnswer: boolean,
  showInstructions: boolean,
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
  settings,
}) => {
  const values = obj => {
    const arr = [];
    const values = Object.keys(obj).map(k => parseInt(k, 10));
    const maxIdx = Math.max(...values);

    for (let i = 0; i <= maxIdx; ++i)
      arr[i] = obj[i];

    return arr;
  };

  const { question } = game;
  let selectedChoices: Array<ChoiceType> = values(player.selection);

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
      Object.keys(player.selection).length === question.nb_choices,
    ]),
    showInstructions: settings.showInstructions,
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
  showInstructions,
}: QuestionViewProps) => {
  const onCardClicked = () => {
    if (canSubmitAnswer)
      onSubmitAnswer(selectedChoices);
  };

  const getIndication = () => {
    if (!showInstructions)
      return;

    if (canSubmitAnswer)
      return 'You can submit your answer';

    if (submitted)
      return 'Wait for all players to answer';

    return 'Select an answer';
  }

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

      <div className="game-indication">{getIndication()}</div>

    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionView);
