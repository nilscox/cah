import React, { useEffect } from 'react';

import useAxios from 'axios-hooks';

import { GameDTO } from 'dtos/game.dto';
import { PlayerDTO } from 'dtos/player.dto';

import AnswersList from './components/AnswersList';
import { animated, useSpring } from 'react-spring';

type QuestionMasterSelectionProps = {
  game: GameDTO;
  player: PlayerDTO;
  nextTurn: () => void;
};

const QuestionMasterSelection: React.FC<QuestionMasterSelectionProps> = ({ game, player, nextTurn }) => {
  const [, selectAnswer] = useAxios(
    {
      url: '/api/game/select',
      method: 'POST',
    },
    { manual: true }
  );

  const handleSelectAnswer = (answerIndex: number) => {
    if (player.nick !== game.questionMaster) return;

    selectAnswer({ data: { answerIndex } });
  };

  const lastTurn = game.turns && game.turns[game.turns.length - 1];

  const [nextSpring, setNextSpring] = useSpring(() => ({
    from: { opacity: 0 },
    delay: 3000,
  }));

  useEffect(() => {
    if (game.playState === 'players_answer')
      setNextSpring({ opacity: 1 });
  }, [game.playState]);

  useEffect(() => {
    console.log(game);
  }, [game]);

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
        { game.playState === 'question_master_selection'
          ? <AnswersList question={game.question!} answers={game.answers!} onSelect={handleSelectAnswer} />
          : <AnswersList question={lastTurn!.question} answers={lastTurn!.answers} winner={lastTurn!.winner} />
        }
      </div>
      <div style={{ margin: '30px auto' }}>
        <animated.div style={nextSpring} onClick={nextTurn}>Next</animated.div>
      </div>
    </div>
  );
};

export default QuestionMasterSelection;
