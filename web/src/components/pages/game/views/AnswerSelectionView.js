// @flow

import * as React from 'react';
import { connect } from 'react-redux';

import type { State } from '../../../../types/state';
import type { QuestionType, AnsweredQuestionType } from '../../../../types/models';
import { toClassName } from '../../../../utils';
import { selectAnswer } from '../../../../actions/game';

import AnsweredQuestionCard from '../../../common/AnsweredQuestionCard';

type AnswerSelectionViewStateProps = {|
  question: QuestionType,
  answers: Array<AnsweredQuestionType>,
  canSelectAnswer: boolean,
|};

type AnswerSelectionViewDispatchProps = {|
  onSelectAnswer: AnsweredQuestionType => void,
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

const mapDispatchToProps = dispatch => ({
  onSelectAnswer: answerId => dispatch(selectAnswer(answerId)),
});

const AnswerSelectionView = ({
  question,
  answers,
  canSelectAnswer,
  onSelectAnswer,
}: AnswerSelectionViewProps) => (
  <div className="game-view" id="answer-selection">

    <div className={toClassName(['answers-list', canSelectAnswer && 'can-select'])}>

      {answers.map(answer => (
        <AnsweredQuestionCard
          key={answer.id}
          question={question}
          answer={answer}
          onClick={() => canSelectAnswer ? onSelectAnswer(answer) : undefined} />
      ))}

    </div>

  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(AnswerSelectionView);
