import React, { useState } from 'react';

import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { createGame } from '../../../../domain/game/createGame/createGame';
import { joinGame } from '../../../../domain/game/joinGame/joinGame';
import Button from '../../components/Button';
import { Center } from '../../components/Center';
import { Fade } from '../../components/Fade';
import Flex from '../../components/Flex';
import { Icon } from '../../components/Icon';
import SubmittableInput from '../../components/SubmittableInput';
import { View } from '../../components/View';
import { usePlayer } from '../../hooks/player';
import ChevronRight from '../../icons/chevron-right.svg';
import { color, spacing, transition } from '../../styles/theme';

import { BackButton } from './BackButton';

const duration = 400;

const ifOpen = <T extends unknown>(yes: T, no: T) => {
  return ({ open }: { open: boolean | null }): T => {
    return open ? yes : no;
  };
};

const height = (open: boolean | null) => {
  if (open) {
    return '100%';
  }

  if (open === false) {
    return '0%';
  }

  return '50%';
};

const PartContainer = styled.div<{ open: boolean | null }>`
  flex-grow: ${ifOpen(0, 1)};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: ${({ open }) => height(open)};
  transition: ${transition('all')};
`;

const PartContent = styled(Flex)<{ open: boolean | null }>`
  height: ${ifOpen('100%', '0%')};
  opacity: ${ifOpen(1, 0)};
  transition: ${transition('all')};
  /* transition-delay: ${ifOpen(1.5 * duration, 0)}ms; */
  overflow: hidden;
`;

type PartProps = {
  open: boolean | null;
  onOpen: () => void;
  label: string;
};

const Part: React.FC<PartProps> = ({ open, onOpen, label, children }) => (
  <PartContainer open={open}>
    <Button size="big" onClick={onOpen}>
      {label}
    </Button>
    <PartContent open={open}>{children}</PartContent>
  </PartContainer>
);

const JoinGame: React.FC = () => {
  const dispatch = useDispatch();
  const [code, setCode] = useState('');

  return (
    <>
      <p>Entrez le code de la partie à rejoindre.</p>
      <p>Si vous n'avez pas de code, l'un des joueur doit créer une partie.</p>
      <Center>
        <SubmittableInput
          placeholder="Code de partie"
          value={code}
          onTextChange={setCode}
          onSubmit={() => dispatch(joinGame(code))}
        />
      </Center>
    </>
  );
};

const CreateGame: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <>
      <p>En cliquant sur continuer, vous allez créer une partie de Cards Against Humanity.</p>
      <p>Un code sera généré pour que les autres joueurs puissent vous rejoindre.</p>
      <Center>
        <Button onClick={() => dispatch(createGame())}>
          Continuer <Icon as={ChevronRight} />
        </Button>
      </Center>
    </>
  );
};

const Separator = styled.hr<{ show: boolean }>`
  border: 0;
  border-top: ${({ show }) => (show ? 1 : 0)}px solid ${color('border')};
  transition: ${transition('border-top')};
  margin: ${spacing(0, 4)};
`;

const LobbyView: React.FC = () => {
  const player = usePlayer();
  const [open, setOpen] = useState<'join' | 'create' | null>(null);

  const joinOpen = open === null ? null : open === 'join';
  const createOpen = open === null ? null : open === 'create';

  return (
    <View player={player} icon={<BackButton show={open !== null} onBack={() => setOpen(null)} />}>
      <Part open={joinOpen} onOpen={() => setOpen('join')} label="Rejoindre une partie">
        <JoinGame />
      </Part>

      <Fade show={open === null}>
        <Separator show={open === null} />
      </Fade>

      <Part open={createOpen} onOpen={() => setOpen('create')} label="Créer une partie">
        <CreateGame />
      </Part>
    </View>
  );
};

export default LobbyView;
