import React from 'react';

import { QuestionDTO } from 'dtos/question.dto';
import { ChoiceDTO } from 'dtos/choice.dto';

const Blank: React.FC = () => (
  <span style={{ width: 30, marginBottom: -2, display: 'inline-block', borderBottom: '1px solid #789' }} />
);

const getChunks = (question: QuestionDTO, choices: (ChoiceDTO | null)[]) => {
  if (question.blanks) {
    const chunks = [];
    let lastPos = 0;

    question.blanks.map((pos, n) => {
      chunks.push({ chunk: question.text.slice(lastPos, pos), from: 'question' });
      chunks.push({ chunk: choices[n]?.text || null, from: 'choice' });
      lastPos = pos;
    });

    chunks.push({ chunk: question.text.slice(lastPos), from: 'question' });

    return chunks.filter(({ chunk }) => chunk !== '');
  } else {
    return [{ chunk: question.text, from: 'question' }, { chunk: ' ', from: 'question' }, { chunk: choices[0]?.text || null, form: 'choice' }];
  }
};

type QuestionProps = {
  dense?: boolean;
  question: QuestionDTO;
  choices: (ChoiceDTO | null)[];
};

const Question: React.FC<QuestionProps> = ({ dense, question, choices }) => (
  <span style={{ fontSize: dense ? 12 : 'initial', lineHeight: dense ? 1.3 : 1.6 }}>
    { getChunks(question, choices).map(({ chunk, from }, n) =>
      chunk === null
        ? <Blank key={n} />
        : <span key={n} style={{ fontWeight: from === 'choice' ? 'bold' : 'initial' }}>{ chunk }</span>
    ) }
  </span>
);

export default Question;
