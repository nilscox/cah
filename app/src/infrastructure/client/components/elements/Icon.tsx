import React from 'react';

import styled from 'styled-components';

import { spacing } from '../../styles/theme';

type IconProps = React.SVGProps<SVGSVGElement> & {
  as: React.ComponentType;
};

const IconComponent: React.FC<IconProps> = ({ as: Component }) => <Component />;

export const Icon = styled(IconComponent)<{ size?: number }>`
  width: ${({ size = 4 }) => spacing(size)};
  height: ${({ size = 4 }) => spacing(size)};
`;
