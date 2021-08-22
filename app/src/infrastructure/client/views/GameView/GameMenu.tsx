import React, { useState } from 'react';

import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';

import { Turn } from '../../../../domain/entities/Turn';
import { flushCards } from '../../../../domain/usecases/game/flushCards/flushCards';
import { selectGame, selectScores, selectTurns } from '../../../../store/selectors/gameSelectors';
import { selectCanFlushCards } from '../../../../store/selectors/playerSelectors';
import { QuestionCard } from '../../components/domain/QuestionCard';
import Button from '../../components/elements/Button';
import { Icon } from '../../components/elements/Icon';
import { Box } from '../../components/layout/Box';
import { Flex } from '../../components/layout/Flex';
import IconChat from '../../icons/chat.svg';
import IconDouble from '../../icons/double.svg';
import IconKey from '../../icons/key.svg';
import IconLoop from '../../icons/loop.svg';
import IconPerson from '../../icons/person.svg';
import IconSkip from '../../icons/skip.svg';
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

type MenuItemProps = {
  icon: React.ComponentType<SVGSVGElement>;
};

const MenuItem: React.FC<MenuItemProps> = ({ icon, children }) => (
  <Flex flexDirection="row" alignItems="center" paddingY={1}>
    <Icon as={icon} size={3} />
    <Box marginLeft={2}>{children}</Box>
  </Flex>
);

const PlayerScore = styled.span`
  font-size: ${fontSize('small')};
`;

const JokerButton = styled(Button)`
  flex-direction: column;
  text-align: center;
  font-size: ${fontSize('small')};
`;

type JokerProps = {
  icon: React.ComponentType<SVGSVGElement>;
  disabled: boolean;
  onClick: () => void;
};

const JokersContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: ${spacing(1)};
`;

const Joker: React.FC<JokerProps> = ({ icon, disabled, onClick, children }) => (
  <JokerButton disabled={disabled} onClick={onClick}>
    <Icon as={icon} />
    <Box marginTop={1}>{children}</Box>
  </JokerButton>
);

const Jokers: React.FC = () => {
  const canFlushCards = useSelector(selectCanFlushCards);
  const dispatch = useDispatch();

  return (
    <Box paddingY={2}>
      <Box textAlign="center" marginBottom={1}>
        Jokers
      </Box>
      <JokersContainer>
        <Joker icon={IconLoop} disabled={!canFlushCards} onClick={() => dispatch(flushCards())}>
          Changer toutes ses cartes
        </Joker>
        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
        <Joker icon={IconDouble} disabled onClick={() => {}}>
          Donner deux réponses
        </Joker>
        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
        <Joker icon={IconSkip} disabled onClick={() => {}}>
          Passer la question
        </Joker>
      </JokersContainer>
    </Box>
  );
};

const Scores: React.FC = () => {
  const scores = useSelector(selectScores);

  return (
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
  );
};

const GameMenu: React.FC = () => {
  const game = useSelector(selectGame);

  return (
    <Box padding={2}>
      <MenuItem icon={IconKey}>Code de la partie : {game.code}</MenuItem>
      <MenuItem icon={IconPerson}>Question Master : {game.questionMaster.nick}</MenuItem>
      <MenuItem icon={IconChat}>
        Question : {game.turns.length + 1} / {game.totalQuestions}
      </MenuItem>
      <Jokers />
      <Scores />
      <Turns />
    </Box>
  );
};

export default GameMenu;
