import React from 'react';
import { ChoiceDTO } from 'dtos/choice.dto';
import { QuestionDTO } from 'dtos/question.dto';
import Question from '../Question';
import { AnswerDTO } from 'dtos/answer.dto';
import { animated, useTrail, useSpring } from 'react-spring';

type AnswersListProps = {
  question: QuestionDTO;
  answers: AnswerDTO[];
  winner?: string;
  onSelect?: (index: number) => void;
};

const AnswersList: React.FC<AnswersListProps> = ({ question, answers, winner, onSelect }) => {
  const winnerSpring = useSpring({
    config: { tension: 70 },
    from: { opacity: 0 },
    to: { opacity: 1 },
    onRest: () => setTrail({ opacity: 1 }),
  });

  const [trail, setTrail] = useTrail(answers.length, () => ({
    from: { opacity: 0 },
  }));

  return (
    <>
      {answers.map((answer: AnswerDTO, idx: number) => (
        <div
          key={idx}
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
          onClick={() => onSelect?.(idx)}
        >
          <div style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', minWidth: 80 }}>
            {answer.player && (
              <animated.div
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  paddingRight: 5,
                  ...trail[idx],
                  ...(winner === answer.player && { ...winnerSpring, color: '#7C9' }),
                }}
              >
                {answer.player}
              </animated.div>
            )}
          </div>
          <div
            style={{
              flex: 3,
              border: '1px solid #789',
              borderTop: idx < answers.length! - 1 ? '1px solid #789' : 'none',
              padding: 10,
            }}
          >
            {question.blanks ? <Question question={question} choices={answer.choices} /> : answer.choices[0].text}
          </div>
        </div>
      ))}
    </>
  );
};

export default AnswersList;
