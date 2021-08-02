import React from 'react';

import styled from '@emotion/styled';
import { Flex } from 'reflexbox';

import Button from '../../components/elements/Button';
import { transition } from '../../styles/theme';

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
  overflow: hidden;
`;

type PartProps = {
  open: boolean | null;
  onOpen: () => void;
  label: string;
};

export const Part: React.FC<PartProps> = ({ open, onOpen, label, children }) => (
  <PartContainer open={open}>
    <Button size="big" onClick={onOpen}>
      {label}
    </Button>
    <PartContent open={open}>{children}</PartContent>
  </PartContainer>
);
