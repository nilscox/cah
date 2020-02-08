import React from 'react';

import { QuestionDTO } from 'dtos/question.dto';
import { ChoiceDTO } from 'dtos/choice.dto';

const Blank: React.FC = () => (
  <span style={{ width: 30, marginBottom: -2, display: 'inline-block', borderBottom: '1px solid #789' }} />
);

const getChoiceText = (choice: ChoiceDTO | null) => {
  if (!choice) {
    return null;
  }

  if (choice.keepCapitalization) {
    return choice.text;
  }

  return choice.text.toLowerCase();
};

const getChunks = (question: QuestionDTO, choices: (ChoiceDTO | null)[]) => {
  if (question.blanks) {
    const chunks = [];
    let lastPos = 0;

    question.blanks.map((pos, n) => {
      chunks.push({ chunk: question.text.slice(lastPos, pos), from: 'question' });
      chunks.push({ chunk: getChoiceText(choices[n]), from: 'choice' });
      lastPos = pos;
    });

    chunks.push({ chunk: question.text.slice(lastPos), from: 'question' });

    return chunks.filter(({ chunk }) => chunk !== '');
  } else {
    return [
      { chunk: question.text, from: 'question' },
      { chunk: ' ', from: 'question' },
      { chunk: getChoiceText(choices[0]), from: 'choice' },
    ];
  }
};

type QuestionProps = {
  dense?: boolean;
  highlight?: boolean;
  question: QuestionDTO;
  choices: (ChoiceDTO | null)[];
};

const Question: React.FC<QuestionProps> = ({ dense, highlight, question, choices }) => (
  <span style={{ fontSize: dense ? 12 : 'initial', lineHeight: dense ? 1.3 : 1.6 }}>
    {getChunks(question, choices).map(({ chunk, from }, n) =>
      chunk === null ? (
        <Blank key={n} />
      ) : (
        <span
          key={n}
          style={{
            ...(!highlight && from === 'choice' && { color: '#ABC' }),
            ...(highlight && { color: '#7C9' }),
          }}
        >
          {chunk}
        </span>
      )
    )}
  </span>
);

export default Question;
