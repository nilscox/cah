import React, { useState } from 'react';

import useAxios from 'axios-hooks';

import { GameDTO } from 'dtos/game.dto';
import { PlayerDTO } from 'dtos/player.dto';
import { ChoiceDTO } from 'dtos/choice.dto';

import QuestionCard from './QuestionCard';

type PlayersAnsmerProps = {
  game: GameDTO;
  player: PlayerDTO;
};

const PlayersAnswer: React.FC<PlayersAnsmerProps> = ({ game, player }) => {
  const [choices, setChoices] = useState<(ChoiceDTO | undefined)[]>([]);

  const [, answer] = useAxios({
    url: '/api/game/answer',
    method: 'POST',
  }, { manual: true });

  const handleToggleChoice = (choice: any) => {
    if (player.nick === game.questionMaster)
      return;

    const idx = choices.indexOf(choice);

    if (game.question?.blanks === null) {
      if (idx === -1) {
        if (choices.length <= 1) {
          setChoices([choice]);
          return;
        }
      }
    } else {
      if (game.question?.blanks) {
        if (idx === -1) {
          if (choices.some((c) => c === undefined)) {
            const placeIndex = choices.findIndex((c) => c === undefined)
            const updatedChoices = [...choices];

            updatedChoices.splice(placeIndex, 1, choice);

            setChoices(updatedChoices);
          }

          if (choices.length < game.question?.blanks?.length) {
            setChoices([...choices, choice]);
          }
        } else {
          const updatedChoices = [...choices];
          updatedChoices.splice(idx, 1, undefined);

          setChoices(updatedChoices);
        }
      }
    }
  };

  const handleAnswer = () => {
    if (player.nick === game.questionMaster)
      return;

    if (game.question?.blanks === null && choices.length !== 1)
      return;

    if (game.question?.blanks && choices.length !== game.question?.blanks.length)
      return;

    answer({ data: { cards: choices.map((c) => c?.text) } });
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 30 }}>
        <QuestionCard question={game.question!} choices={choices} validate={handleAnswer} />
      </div>

      <div style={{ flex: 2, overflow: 'auto' }}>
        <ul>
          { player.cards?.map((c: any) => (
            <li key={c.text} onClick={() => handleToggleChoice(c)} style={{ backgroundColor: choices.includes(c) ? '#ccc' : '#fff', padding: 12, borderBottom: '1px solid #CCC' }}>
              { c.text }
            </li>
          )) }
        </ul>
      </div>
    </div>
  );
};

export default PlayersAnswer;
