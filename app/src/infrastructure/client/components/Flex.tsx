import styled, { CSSProperties } from 'styled-components';

type FlexProps = {
  className?: string;
  direction?: CSSProperties['flexDirection'];
  alignItems?: CSSProperties['alignItems'];
  flex?: number;
  height?: CSSProperties['height'];
};

const Flex = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${(props) => props.direction ?? 'column'};
  align-items: ${(props) => props.alignItems};
  flex: ${(props) => props.flex};
  height: ${(props) => props.height};
`;

export default Flex;
