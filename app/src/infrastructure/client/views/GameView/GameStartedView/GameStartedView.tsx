import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { setChoices } from '../../../../../domain/actions';
import { GameState } from '../../../../../domain/entities/Game';
import { toggleChoice } from '../../../../../domain/usecases/player/toggleChoice/toggleChoice';
import { ChoicesList } from '../../../components/domain/ChoicesList';
import { QuestionCard } from '../../../components/domain/QuestionCard';
import { useGame } from '../../../hooks/useGame';
import { choicesSelectionSelector, usePlayer } from '../../../hooks/usePlayer';

export const GameStartedView: React.FC = () => {
  const dispatch = useDispatch();

  const game = useGame();
  const player = usePlayer();
  const selection = useSelector(choicesSelectionSelector);

  if (game.state !== GameState.started) {
    return null;
  }

  return (
    <>
      <QuestionCard question={game.question} choices={selection} />
      <ChoicesList
        choices={player.cards}
        selection={selection}
        onChoiceClick={(choice) => dispatch(toggleChoice(choice))}
        onOrderChange={(choices) => dispatch(setChoices(choices))}
      />
    </>
  );
};
