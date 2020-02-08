import React, { useEffect, useState } from 'react';

import useAxios from 'axios-hooks';

import { GameDTO } from 'dtos/game.dto';
import { PlayerDTO } from 'dtos/player.dto';

import AnswersList from './components/AnswersList';
import { animated, useSpring } from 'react-spring';

const NextTurn: React.FC = () => {
  const [, nextTurn] = useAxios(
    {
      url: '/api/game/next',
      method: 'POST',
    },
    { manual: true }
  );

  const spring = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 3000,
  });

  return (
    <animated.div style={{ ...spring, cursor: 'pointer' }} onClick={() => nextTurn()}>
      Next
    </animated.div>
  );
};

type QuestionMasterSelectionProps = {
  game: GameDTO;
  player: PlayerDTO;
};

const QuestionMasterSelection: React.FC<QuestionMasterSelectionProps> = ({ game, player }) => {
  const isQuestionMaster = player.nick === game.questionMaster;

  const [, selectAnswer] = useAxios(
    {
      url: '/api/game/select',
      method: 'POST',
    },
    { manual: true }
  );

  const lastTurn = game.turns && game.turns[game.turns.length - 1];

  return (
    <div
      style={{
        height: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '5%',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {game.playState === 'question_master_selection' ? (
          <AnswersList
            question={game.question!}
            answers={game.answers!}
            onSelect={isQuestionMaster ? (answerIndex) => selectAnswer({ data: { answerIndex } }) : undefined}
          />
        ) : (
          <AnswersList question={lastTurn!.question} answers={lastTurn!.answers} winner={lastTurn!.winner} />
        )}
      </div>
      <div style={{ margin: '30px auto' }}>
        {isQuestionMaster && game.playState === 'end_of_turn' ? <NextTurn /> : '\u00A0'}
      </div>
    </div>
  );
};

export default QuestionMasterSelection;
