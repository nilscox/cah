import React from 'react';

import { QuestionDTO } from 'dtos/question.dto';
import { ChoiceDTO } from 'dtos/choice.dto';

const Blank: React.FC = () => (
  <span style={{ height: 2, width: 30, display: 'inline-block', borderBottom: '1px solid #ccc' }} />
);

type QuestionCardProps = {
  question: QuestionDTO;
  choices: (ChoiceDTO | undefined)[];
  validate: () => void;
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question, choices, validate }) => {
  const renderQuestion = () => {
    if (!question.blanks && choices.length === 1)
      return (
        <span onClick={validate}>
          <span>{ question.text }</span>
          <span>{ choices[0]?.text }</span>
        </span>
      );

    if (question.blanks && (choices.length === 0 || choices.every((c) => c === undefined))) {
      const splitQuestionText = question.text.split(' ');
      let startIndex = 0;

      return (
        <span>
          { question.blanks.map((blank) => {
            const text = splitQuestionText.slice(startIndex, blank).join(' ');
            startIndex = blank;

            return <span key={text}>{ text } <Blank /> </span>
          }) }
          <span>{ splitQuestionText.slice(startIndex).join(' ') }</span>
        </span>
      );
    }

    if (question.blanks && choices.length > 0) {
      const splitQuestionText = question.text.split(' ');
      let startIndex = 0;

      return (
        <span onClick={validate}>
          { question.blanks.map((blank, idx) => {
            const text = splitQuestionText.slice(startIndex, blank).join(' ');
            startIndex = blank;

            return <span key={text}>{ text } { choices[idx] ? choices[idx]?.text : <Blank /> } </span>
          }) }
          <span>{ splitQuestionText.slice(startIndex).join(' ') }</span>
        </span>
      );
    }

    return <span>{ question.text }</span>
  };


  return (
    <>
      { renderQuestion() }
    </>
  );
};

export default QuestionCard;
