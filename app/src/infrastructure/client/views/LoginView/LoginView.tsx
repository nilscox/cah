import React, { useState } from 'react';

import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { login } from '../../../../domain/usecases/player/login/login';
import { Fade } from '../../components/Fade';
import SubmittableInput from '../../components/SubmittableInput';
import { useTimeout } from '../../hooks/useTimeout';
import { spacing } from '../../styles/theme';

import MainTitle from './MainTitle';

const Container = styled.div`
  padding: ${spacing(4)};
`;

const StyledMainTitle = styled(MainTitle)`
  margin: ${spacing(0, 0, 8)};
`;

type NickInputProps = {
  onSubmit: (nick: string) => void;
};

const NickInput: React.FC<NickInputProps> = ({ onSubmit }) => {
  const [nick, setNick] = useState('');
  const [show, setShow] = useState(false);

  useTimeout(() => setShow(true), 0);

  return (
    <Fade show={show} duration="slow">
      <SubmittableInput
        placeholder="Entrez votre pseudo..."
        value={nick}
        onTextChange={setNick}
        onSubmit={() => onSubmit(nick)}
      />
    </Fade>
  );
};

const LoginView: React.FC = () => {
  const dispatch = useDispatch();
  const [showNickInput, setShowNickInput] = useState(false);

  return (
    <Container>
      <StyledMainTitle onRest={() => setShowNickInput(true)} />
      {showNickInput && <NickInput onSubmit={(nick) => dispatch(login(nick))} />}
    </Container>
  );
};

export default LoginView;
