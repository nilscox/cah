import styled, { CSSProperties } from 'styled-components';

type FlexProps = {
  direction?: CSSProperties['flexDirection'];
  alignItems?: CSSProperties['alignItems'];
  flex?: number;
};

const Flex = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${(props) => props.direction ?? 'column'};
  align-items: ${(props) => props.alignItems};
  flex: ${(props) => props.flex};
`;

export default Flex;
