// @flow

import * as React from 'react';
import { connect } from 'react-redux';

import type { Dispatch, Action } from '../../../../types/actions';
import type { State } from '../../../../types/state';
import type { QuestionType, PartialAnsweredQuestionType } from '../../../../types/models';
import { toClassName } from '../../../../utils';
import { selectAnswer } from '../../../../actions/game';

import AnsweredQuestionCard from '../../../common/AnsweredQuestionCard';

type AnswerSelectionViewStateProps = {|
  question: QuestionType,
  answers: Array<PartialAnsweredQuestionType>,
  canSelectAnswer: boolean,
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
}) => ({
  question: game.question,
  answers: game.propositions,
  canSelectAnswer: game.question_master === player.nick,
});

const mapDispatchToProps: Dispatch => AnswerSelectionViewDispatchProps = dispatch => ({
  onSelectAnswer: answer => dispatch(selectAnswer(answer.id)),
});

const AnswerSelectionView = ({
  question,
  answers,
  canSelectAnswer,
  onSelectAnswer,
}: AnswerSelectionViewProps) => {
  const onCardClicked = answer => {
    if (canSelectAnswer)
      onSelectAnswer(answer);
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

    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(AnswerSelectionView);
