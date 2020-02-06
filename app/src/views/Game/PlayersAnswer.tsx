import React, { useState, useEffect } from 'react';

import useAxios from 'axios-hooks';

import { GameDTO } from 'dtos/game.dto';
import { PlayerDTO } from 'dtos/player.dto';
import { ChoiceDTO } from 'dtos/choice.dto';

import Question from './Question';
import CardsList from './components/CardsList';

const useSelection = (length: number, isQuestionMaster: boolean) => {
  const [selection, setSelection] = useState<(ChoiceDTO | null)[]>(new Array(length).fill(null));

  const canSelect = (choice: ChoiceDTO) => {
    if (isQuestionMaster) {
      return false;
    }

    if (selection.includes(null)) {
      return true;
    }

    return selection.includes(choice);
  };

  const toggleSelection = (choice: ChoiceDTO) => {
    if (isQuestionMaster) {
      return;
    }

    const idx = selection.indexOf(choice);

    if (idx === -1) {
      const firstEmptyIdx = selection.findIndex(c => c === null);

      if (firstEmptyIdx >= 0) {
        setSelection([...selection.slice(0, firstEmptyIdx), choice, ...selection.slice(firstEmptyIdx + 1)]);
      }
    } else {
      setSelection([...selection.slice(0, idx), null, ...selection.slice(idx + 1)]);
    }
  };

  return [
    selection,
    setSelection,
    {
      canSelect,
      toggleSelection,
    },
  ] as const;
};

const usePlayerAnswer = (player: PlayerDTO, game: GameDTO) => {
  const [selection, setSelection, { canSelect, toggleSelection }] = useSelection(
    game.question?.blanks?.length || 1,
    player.nick === game.questionMaster
  );

  useEffect(() => {
    if (player.selection && player.selection.length > 0) setSelection(player.selection);
  }, [player.selection]);

  const didAnswer = game.answered?.includes(player.nick);

  const canAnswer = [player.nick !== game.questionMaster, !selection.includes(null), !didAnswer].every(value => value);

  const [{ error }, answer] = useAxios(
    {
      url: '/api/game/answer',
      method: 'POST',
    },
    { manual: true }
  );

  const handleAnswer = () => {
    if (canAnswer) {
      answer({ data: { cards: selection.map(c => c?.text) } });
    }
  };

  return {
    selection,
    canSelect,
    toggleSelection,
    canAnswer,
    didAnswer,
    handleAnswer,
  } as const;
};

type PlayersAnsmerProps = {
  game: GameDTO;
  player: PlayerDTO;
};

const PlayersAnswer: React.FC<PlayersAnsmerProps> = ({ game, player }) => {
  const { selection, canSelect, toggleSelection, canAnswer, didAnswer, handleAnswer } = usePlayerAnswer(player, game);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 30px',
          cursor: canAnswer ? 'pointer' : 'initial',
        }}
        onClick={handleAnswer}
      >
        <Question style={{ color: didAnswer ? '#7C9' : 'inherit' }} question={game.question!} choices={selection} />
      </div>

      <div style={{ flex: 2, overflow: 'auto' }}>
        <CardsList
          cards={player.cards!}
          onSelect={toggleSelection}
          isSelected={c => selection.includes(c)}
          canSelect={canSelect}
        />
      </div>
    </div>
  );
};

export default PlayersAnswer;
