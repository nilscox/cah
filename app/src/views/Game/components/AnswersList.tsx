import React, { useEffect } from 'react';
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
  const [winnerSpring, setWinnerSpring] = useSpring(() => ({
    config: { tension: 70 },
    from: { opacity: 0 },
    onRest: () => setTrail({ opacity: 1 }),
  }));

  const [trail, setTrail] = useTrail(answers.length, () => ({
    from: { opacity: 0 },
  }));

  useEffect(() => {
    if (winner) {
      setWinnerSpring({ opacity:1 });
    }
  }, [winner]);

  return (
    <>
      {answers.map((answer: AnswerDTO, idx: number) => (
        <div
          key={idx}
          style={{
            display: 'flex',
            flexDirection: 'row',
            cursor: onSelect ? 'pointer' : 'initial',
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
              borderBottom: idx < answers.length! - 1 ? '1px solid #789' : 'none',
              padding: '10px 0',
            }}
          >
            {question.blanks ? <Question dense question={question} choices={answer.choices} /> : answer.choices[0].text}
          </div>
        </div>
      ))}
    </>
  );
};

export default AnswersList;
