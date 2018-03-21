// @flow

import * as React from 'react';

import type { QuestionType, ChoiceType } from 'Types/models';
import { toClassName } from '../../utils';

type QuestionCardProps = {|
  className?: string,
  question: QuestionType,
  choices: Array<ChoiceType>,
  onClick?: (SyntheticEvent<>) => void,
|};

const QuestionCard = ({
  question,
  choices,
  className,
  onClick,
}: QuestionCardProps) => {
  let choiceIdx = 0;

  const text = question.split.map((text, idx) => {
    const className = [];

    if (!text) {
      if (choices[choiceIdx]) {
        className.push('filled');
        text = choices[choiceIdx].text;
      } else
        className.push('blank');

      choiceIdx++;
    }

    return <span key={idx} className={className}>{text}</span>;
  });

  if (question.type === 'question') {
    const choice = choices[0] && choices[0].text;

    text.push(<div className="question-answer-separator" key={null} />);
    text.push(<span key={text.length} className={choice ? 'filled' : 'blank'}>{choice}</span>);
  }

  return (
    <div
      className={toClassName(['card', 'question', className])}
      onClick={onClick}>
      <div className="text">{text}</div>
    </div>
  );
};

export default QuestionCard;
