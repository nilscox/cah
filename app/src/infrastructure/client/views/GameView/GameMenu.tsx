import React, { useState } from 'react';

import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';

import { Turn } from '../../../../domain/entities/Turn';
import { flushCards } from '../../../../domain/usecases/game/flushCards/flushCards';
import { selectGame, selectScores, selectTurns } from '../../../../store/selectors/gameSelectors';
import { QuestionCard } from '../../components/domain/QuestionCard';
import Button from '../../components/elements/Button';
import { Box } from '../../components/layout/Box';
import { Flex } from '../../components/layout/Flex';
import { fontSize, fontWeight, spacing } from '../../styles/theme';

const TurnContainer = styled(Flex)<{ details: boolean }>`
  margin: ${({ details }) => spacing(details ? 4 : 1, 0)};
  font-size: ${fontSize('small')};
`;

const TurnNumber = styled.div`
  min-width: ${spacing(4)};
`;

const QuestionCardButton = styled(Button)`
  font-weight: initial;
`;

const Winner = styled.div`
  margin: ${spacing(2, 0)};
  font-weight: ${fontWeight('bold')};
`;

type TurnProps = {
  turn: Turn;
  details: boolean;
  onClick: () => void;
};

const TurnComponent: React.FC<TurnProps> = ({ turn, details, onClick }) => (
  <TurnContainer flexDirection="row" marginY={1} details={details}>
    <TurnNumber>{turn.number}</TurnNumber>
    <Flex flex={1}>
      <QuestionCardButton onClick={onClick}>
        <QuestionCard question={turn.question} choices={[]} />
      </QuestionCardButton>
      {details && (
        <>
          <Winner>Gagnant(e) : {turn.winner.nick}</Winner>
          {turn.answers.map((answer) => (
            <Box key={answer.id} marginY={1}>
              {answer.player.nick} : {answer.formatted}
            </Box>
          ))}
        </>
      )}
    </Flex>
  </TurnContainer>
);

const Turns: React.FC = () => {
  const turns = useSelector(selectTurns);
  const [details, setDetails] = useState<number>();

  const toggle = (turn: Turn) => () => {
    if (turn.number === details) {
      setDetails(undefined);
    } else {
      setDetails(turn.number);
    }
  };

  return (
    <>
      {turns.map((turn) => (
        <TurnComponent key={turn.number} turn={turn} details={details === turn.number} onClick={toggle(turn)} />
      ))}
    </>
  );
};

const PlayerScore = styled.span`
  font-size: ${fontSize('small')};
`;

const GameMenu: React.FC = () => {
  const game = useSelector(selectGame);
  const dispatch = useDispatch();

  const scores = useSelector(selectScores);

  return (
    <Box padding={2}>
      <Box paddingY={2}>Code de la partie : {game.code}</Box>
      <Box paddingY={2}>Question Master : {game.questionMaster.nick}</Box>
      <Box paddingY={2}>
        <Button onClick={() => dispatch(flushCards())}>Changer toutes ses cartes</Button>
      </Box>
      <Box paddingY={2}>
        <div>Scores :</div>
        <ol>
          {scores.map(([player, score]) => (
            <li key={player.id}>
              {player.nick} <PlayerScore>({score} points)</PlayerScore>
            </li>
          ))}
        </ol>
      </Box>
      <Turns />
    </Box>
  );
};

export default GameMenu;
