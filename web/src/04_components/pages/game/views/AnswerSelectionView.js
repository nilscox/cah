// @flow

import * as React from 'react';
import { connect } from 'react-redux';

import type { Dispatch, Action } from 'Types/actions';
import type { State } from 'Types/state';
import type { QuestionType, PartialAnsweredQuestionType } from 'Types/models';
import { toClassName } from '../../../../utils';
import { selectAnswer } from 'Actions/game';

import AnsweredQuestionCard from '../../../common/AnsweredQuestionCard';

type AnswerSelectionViewStateProps = {|
  question: QuestionType,
  answers: Array<PartialAnsweredQuestionType>,
  canSelectAnswer: boolean,
  showInstructions: boolean,
|};

type AnswerSelectionViewDispatchProps = {|
  onSelectAnswer: PartialAnsweredQuestionType => Action,
|};

type AnswerSelectionViewProps =
  & AnswerSelectionViewStateProps
  & AnswerSelectionViewDispatchProps;

const mapStateToProps: State => AnswerSelectionViewStateProps = ({
  game,
  player,
  settings,
}) => ({
  question: game.question,
  answers: game.propositions,
  canSelectAnswer: game.question_master === player.nick,
  showInstructions: settings.showInstructions,
});

const mapDispatchToProps: Dispatch => AnswerSelectionViewDispatchProps = dispatch => ({
  onSelectAnswer: answer => dispatch(selectAnswer(answer.id)),
});

const AnswerSelectionView = ({
  question,
  answers,
  canSelectAnswer,
  onSelectAnswer,
  showInstructions,
}: AnswerSelectionViewProps) => {
  const onCardClicked = answer => {
    if (canSelectAnswer)
      onSelectAnswer(answer);
  };

  const getIndication = () => {
    if (!showInstructions)
      return;

    if (canSelectAnswer)
      return 'Select an answer';

    return 'Waiting for the question master...';
  };

  return (
    <div className="game-view" id="answer-selection">

      <div className={toClassName(['answers-list', canSelectAnswer && 'can-select'])}>

        {answers.map(answer => (
          <AnsweredQuestionCard
            key={answer.id}
            question={question}
            answer={answer.answers}
            onClick={() => onCardClicked(answer)}
          />
        ))}

      </div>

      <div className="game-indication">{getIndication()}</div>

    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(AnswerSelectionView);
