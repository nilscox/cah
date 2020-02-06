import React from 'react';

import useAxios from 'axios-hooks';

import { GameDTO } from 'dtos/game.dto';
import { PlayerDTO } from 'dtos/player.dto';
import { ChoiceDTO } from 'dtos/choice.dto';

import Question from './Question';

type QuestionMasterSelectionProps = {
  game: GameDTO;
  player: PlayerDTO;
};

const QuestionMasterSelection: React.FC<QuestionMasterSelectionProps> = ({ game, player }) => {
  const [, selectAnswer] = useAxios({
    url: '/api/game/select',
    method: 'POST',
  }, { manual: true });

  const handleSelectAnswer = (answerIndex: number) => {
    if (player.nick !== game.questionMaster)
      return;

    selectAnswer({ data: { answerIndex } });
  };

  return (
    <div style={{ height: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <ul>
        { game.answers?.map((a: ChoiceDTO[], idx: number) => (
          <li key={idx} style={{ padding: 10, borderTop: (idx < game?.answers?.length! - 1) ? '1px solid #789' : 'none', borderBottom: '1px solid #789' }} onClick={() => handleSelectAnswer(idx)}>
            { game.question?.blanks
              ? <Question question={game.question!} choices={a} />
              : a[0].text
            }
          </li>
        )) }
      </ul>
    </div>
  );
};

export default QuestionMasterSelection;
