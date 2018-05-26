import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 50,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 25,
    textAlign: 'center',
  },
  subText: {
    fontSize: 12,
    textAlign: 'center',
  }
});

const ApiDownScreen = () => (
  <View style={styles.wrapper}>
    <Text style={styles.titleText}>Oh no! The API looks down from here.</Text>
    <Text style={styles.subText}>Hold on, happy monkeys are fixing the problem...</Text>
  </View>
);

export default ApiDownScreen;
