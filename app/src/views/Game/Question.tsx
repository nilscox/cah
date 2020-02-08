import React from 'react';

import { QuestionDTO } from 'dtos/question.dto';
import { ChoiceDTO } from 'dtos/choice.dto';

const Blank: React.FC = () => (
  <span style={{ width: 30, marginBottom: -2, display: 'inline-block', borderBottom: '1px solid #ccc' }} />
);

const getChunks = (question: QuestionDTO, choices: (ChoiceDTO | null)[]) => {
  if (question.blanks) {
    const chunks = [];
    let lastPos = 0;

    question.blanks.map((pos, n) => {
      chunks.push(question.text.slice(lastPos, pos));
      chunks.push(choices[n]?.text || null);
      lastPos = pos;
    });

    chunks.push(question.text.slice(lastPos));

    return chunks.filter(chunk => chunk !== '');
  } else {
    return [question.text, ' ', choices[0]?.text || null];
  }
};

type QuestionProps = {
  style?: React.CSSProperties;
  question: QuestionDTO;
  choices: (ChoiceDTO | null)[];
};

const Question: React.FC<QuestionProps> = ({ style, question, choices }) => (
  <div style={{ lineHeight: 1.5, ...style }}>
    { getChunks(question, choices).map((chunk, n) =>
      chunk === null
        ? <Blank key={n} />
        : <span key={n}>{ chunk }</span>
    ) }
  </div>
);

export default Question;
