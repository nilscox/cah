import React from 'react';

import { useSelector } from 'react-redux';

import { selectNotification } from '../../../../store/selectors/appStateSelectors';
import Header, { HeaderRightText } from '../../components/domain/Header';
import { usePlayer } from '../../hooks/usePlayer';

import { BackButton } from './BackButton';

type ViewHeaderProps = {
  open: 'join' | 'create' | null;
  unsetOpen: () => void;
};

export const ViewHeader: React.FC<ViewHeaderProps> = ({ open, unsetOpen }) => {
  const player = usePlayer();
  const notification = useSelector(selectNotification);

  return (
    <Header
      title="CAH"
      notification={notification}
      left={<BackButton show={open !== null} onBack={() => unsetOpen()} />}
      right={<HeaderRightText>{player.nick}</HeaderRightText>}
    />
  );
};
