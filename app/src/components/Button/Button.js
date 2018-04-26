// @flow

import * as React from 'react';
import { TouchableOpacity, Text } from 'react-native';

import type { StyleProp } from '~/types/style';
import { styles, variantBig, variantSmall } from './Button.styles';

type ButtonProps = {
  style?: StyleProp,
  textStyle?: StyleProp,
  variant?: 'big' | 'small',
  onPress: Function,
};

const Button = ({ style, textStyle, onPress, variant }: ButtonProps) => {
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
        Create a new game
      </Text>
    </TouchableOpacity>
  );
}

export default Button;
