import React from 'react';

import styled from 'styled-components';

import { spacing } from '../../styles/theme';

type IconProps = React.SVGProps<SVGSVGElement> & {
  as: React.ComponentType;
};

const IconComponent: React.FC<IconProps> = ({ as: Component }) => <Component />;

export const Icon = styled(IconComponent)`
  width: ${spacing(4)};
  height: ${spacing(4)};
`;
