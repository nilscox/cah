// @flow

import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import LoginForm from './LoginForm';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontFamily: 'luckiest-guy',
    fontSize: 42,
    textAlign: 'center',
  },
  form: {
    flex: 2,
  },
});

const LoginScreen = ({ onLogin }) => (
  <View style={styles.screen}>

    <View style={styles.title}>
      <Text style={styles.titleText}>Cards Against Humanity</Text>
    </View>

    <LoginForm style={styles.form} onLogin={() => {}} />

  </View>
);

export default LoginScreen;
