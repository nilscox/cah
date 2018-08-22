// @flow

import * as React from 'react';
import { TouchableOpacity, Text } from 'react-native';

import type { Style } from '~/types/style';
import { styles, variantBig, variantSmall } from './Button.styles';

type ButtonProps = {
  style?: ?Style,
  textStyle?: ?Style,
  variant?: ?('big' | 'small'),
  onPress: Function,
  children: any,
};

const Button = ({ style, textStyle, onPress, variant, children }: ButtonProps) => {
  const [big, small] = [variant === 'big', variant === 'small'];

  const buttonStyles = [
    styles.button,
    big && variantBig.button,
    small && variantSmall.button,
    style,
  ];

  const textStyles = [
    styles.buttonText,
    big && variantBig.buttonText,
    small && variantSmall.buttonText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
    >
      <Text style={textStyles}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

Button.defaultProps = {
  style: null,
  textStyle: null,
  variant: null,
};

export default Button;