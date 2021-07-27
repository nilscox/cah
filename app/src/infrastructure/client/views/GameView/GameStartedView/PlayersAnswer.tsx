import React from 'react';

import { useSelector } from 'react-redux';

import { setPlayerCards } from '../../../../../domain/actions';
import { GameState } from '../../../../../domain/entities/Game';
import { validateChoicesSelection } from '../../../../../domain/usecases/game/validateChoicesSelection/validateChoicesSelection';
import { toggleChoice } from '../../../../../domain/usecases/player/toggleChoice/toggleChoice';
import { AppState } from '../../../../../store/types';
import { ChoicesList } from '../../../components/domain/ChoicesList';
import { QuestionCard } from '../../../components/domain/QuestionCard';
import { Center } from '../../../components/layout/Center';
import { useAction } from '../../../hooks/useAction';
import { gameSelector, useGame } from '../../../hooks/useGame';
import { choicesSelectionSelector, playerSelector, usePlayer } from '../../../hooks/usePlayer';

const validateButtonVisibleSelector = (state: AppState) => {
  const game = gameSelector(state);
  const selection = choicesSelectionSelector(state);

  return selection.length === game.question.numberOfBlanks;
};

const canSelectChoicesSelector = (state: AppState) => {
  const player = playerSelector(state);
  const game = gameSelector(state);
  const canValidateSelection = canValidateSelectionSelector(state);

  return canValidateSelection && game.questionMaster.nick !== player.nick;
};

const canValidateSelectionSelector = (state: AppState) => {
  const player = playerSelector(state);

  return !player.selectionValidated;
};

export type GuardSelector = (state: AppState) => boolean;

export const PlayersAnswer: React.FC = () => {
  const game = useGame();
  const player = usePlayer();
  const selection = useSelector(choicesSelectionSelector);

  const validateButtonVisible = useSelector(validateButtonVisibleSelector);

  const handleCardsOrderChange = useAction(() => true, setPlayerCards);
  const handleSelectChoices = useAction(canSelectChoicesSelector, toggleChoice);
  const handleValidateSelection = useAction(canValidateSelectionSelector, validateChoicesSelection);

  if (game.state !== GameState.started) {
    return null;
  }

  return (
    <>
      <Center minHeight={24}>
        <QuestionCard question={game.question} choices={selection} />
      </Center>
      <ChoicesList
        choices={player.cards}
        selection={selection}
        validateButtonVisible={validateButtonVisible}
        onOrderChange={handleCardsOrderChange}
        onSelectChoice={handleSelectChoices}
        onValidateSelection={handleValidateSelection}
      />
    </>
  );
};
