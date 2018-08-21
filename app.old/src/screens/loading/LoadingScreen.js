// @flow

import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const LoadingPage = () => (
  <View style={styles.page}>
    <Text>Loading...</Text>
  </View>
);

export default LoadingPage;
