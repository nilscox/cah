import React from 'react';

import useAxios from 'axios-hooks';

import { GameDTO } from 'dtos/game.dto';
import { PlayerDTO } from 'dtos/player.dto';
import { ChoiceDTO } from 'dtos/choice.dto';

import QuestionCard from './QuestionCard';

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
    <div>
      <ul>
        { game.answers?.map((a: ChoiceDTO[], idx: number) => (
          <li key={idx}>
            <QuestionCard question={game.question!} choices={a} validate={() => handleSelectAnswer(idx)} />
          </li>
        )) }
      </ul>
    </div>
  );
};

export default QuestionMasterSelection;
