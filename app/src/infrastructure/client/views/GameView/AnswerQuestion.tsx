import React from 'react';

import { useSelector } from 'react-redux';

import { setPlayerCards } from '../../../../domain/actions';
import { GameState } from '../../../../domain/entities/Game';
import { validateChoicesSelection } from '../../../../domain/usecases/game/validateChoicesSelection/validateChoicesSelection';
import { toggleChoice } from '../../../../domain/usecases/player/toggleChoice/toggleChoice';
import { selectGame } from '../../../../store/selectors/gameSelectors';
import { selectChoicesSelection, selectPlayer } from '../../../../store/selectors/playerSelectors';
import { AppState } from '../../../../store/types';
import { ChoicesList } from '../../components/domain/ChoicesList';
import { QuestionCard } from '../../components/domain/QuestionCard';
import { Center } from '../../components/layout/Center';
import { useAction } from '../../hooks/useAction';
import { useGame } from '../../hooks/useGame';
import { usePlayer } from '../../hooks/usePlayer';

const validateButtonVisibleSelector = (state: AppState) => {
  const game = selectGame(state);
  const selection = selectChoicesSelection(state);

  return selection.length === game.question.numberOfBlanks;
};

const canSelectChoicesSelector = (state: AppState) => {
  const player = selectPlayer(state);
  const game = selectGame(state);
  const canValidateSelection = canValidateSelectionSelector(state);

  return canValidateSelection && game.questionMaster.nick !== player.nick;
};

const canValidateSelectionSelector = (state: AppState) => {
  const player = selectPlayer(state);

  return !player.selectionValidated;
};

export const AnswerQuestion: React.FC = () => {
  const game = useGame();
  const player = usePlayer();
  const selection = useSelector(selectChoicesSelection);

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
        onOrderChange={handleCardsOrderChange}
        onSelectChoice={handleSelectChoices}
        validateButtonVisible={validateButtonVisible}
        onValidateSelection={handleValidateSelection}
      />
    </>
  );
};
