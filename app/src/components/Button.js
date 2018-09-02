import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';


/** Button
props:
  - text
  - onPress
*/

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#EEE',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: '#666',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonTextDisabled: {
    color: '#999',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Button = ({ style, disabled, onPress, children }) => (
  <TouchableOpacity onPress={!disabled && onPress || (() => {})}>
    <View style={style}>
      <View style={styles.button}>
        <Text
          style={[
            styles.buttonText,
            disabled && styles.buttonTextDisabled
          ]}
        >
          { children.toUpperCase() }
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);
