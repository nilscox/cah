import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';


/** Button
props:
  - text
  - onPress
*/

const styles = StyleSheet.create({
  /* eslint-disable react-native/no-unused-styles */
  buttonMedium: {
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  buttonSmall: {
    paddingHorizontal: 5,
  },
  /* eslint-enable react-native/no-unused-styles */
  buttonBackground: {
    backgroundColor: '#EEE',
    borderColor: '#CCC',
    borderBottomWidth: 1,
  },
  buttonText: {
    color: '#666',
    textAlign: 'center',
  },
  buttonTextPrimary: {
    fontWeight: 'bold',
  },
  buttonTextDisabled: {
    color: '#999',
  },
  buttonsGroup: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 30,
  },
  buttonPositionContainer: {
    flex: 1,
  },
});

/* eslint-disable react-native/no-unused-styles */
const stylesPosition = StyleSheet.create({
  top: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  topButton: {
    marginVertical: 20,
  },
  bottom: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bottomButton: {
    marginVertical: 20,
  },
  start: {
    alignItems: 'flex-start',
  },
  end: {
    alignItems: 'flex-end',
  },
});
/* eslint-enable react-native/no-unused-styles */

const Button = ({ style, size, title, primary, background, disabled, onPress }) => (
  <TouchableOpacity onPress={!disabled && onPress || (() => {})}>
    <View style={style}>
      <View style={[
        styles[{ small: 'buttonSmall', medium: 'buttonMedium' }[size]],
        background && styles.buttonBackground,
      ]}>
        <Text
          style={[
            styles.buttonText,
            primary && styles.buttonTextPrimary,
            disabled && styles.buttonTextDisabled,
          ]}
        >
          { title.toUpperCase() }
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

Button.defaultProps = {
  size: 'medium',
};

export default Button;

export const ButtonPosition = ({ position, ...props }) => (
  <View style={[styles.buttonPositionContainer, stylesPosition[position]]}>
    <Button {...props} style={[stylesPosition[position + 'Button'], props.style]} />
  </View>
);

export const ButtonsGroup = ({ children }) => (
  <View style={styles.buttonsGroup}>
    { children }
  </View>
);
