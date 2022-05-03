import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import { Choice } from '../../../../domain/entities/Choice';
import { GameState } from '../../../../domain/entities/game';
import { validateChoicesSelection } from '../../../../domain/usecases/game/validateChoicesSelection/validateChoicesSelection';
import { setCards } from '../../../../domain/usecases/player/setCards/setCards';
import { toggleChoice } from '../../../../domain/usecases/player/toggleChoice/toggleChoice';
import { selectGame } from '../../../../store/selectors/gameSelectors';
import { selectChoicesSelection, selectPlayer } from '../../../../store/selectors/playerSelectors';
import { AppState } from '../../../../store/types';
import { ChoicesList } from '../../components/domain/ChoicesList';
import { QuestionCard } from '../../components/domain/QuestionCard';
import Button from '../../components/elements/Button';
import { BottomAction } from '../../components/layout/BottomAction';
import { Center } from '../../components/layout/Center';
import { useAction } from '../../hooks/useAction';
import { useGame } from '../../hooks/useGame';
import { usePlayer } from '../../hooks/usePlayer';

const canAlwaysDo = () => true;

const setCardsOrder = (cards: Choice[]) => setCards(cards, false);

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

const useMounted = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return mounted;
};

export const AnswerQuestion: React.FC = () => {
  const game = useGame();
  const player = usePlayer();
  const selection = useSelector(selectChoicesSelection);

  const validateButtonVisible = useSelector(validateButtonVisibleSelector);

  const handleCardsOrderChange = useAction(canAlwaysDo, setCardsOrder);
  const handleSelectChoices = useAction(canSelectChoicesSelector, toggleChoice);
  const handleValidateSelection = useAction(canValidateSelectionSelector, validateChoicesSelection);

  const animate = useMounted();

  if (game.state !== GameState.started) {
    return null;
  }

  return (
    <>
      <Center minHeight={9} padding={4}>
        {/* Don't use selection because we want the blanks too */}
        <QuestionCard animate={animate} question={game.question} choices={player.selection} />
      </Center>
      <ChoicesList
        choices={player.cards}
        selection={selection}
        onOrderChange={handleCardsOrderChange}
        onChoiceClick={handleSelectChoices}
      />
      <BottomAction visible={validateButtonVisible}>
        <Button disabled={!handleValidateSelection} onClick={handleValidateSelection}>
          {handleValidateSelection ? 'Valider' : 'Validé'}
        </Button>
      </BottomAction>
    </>
  );
};
