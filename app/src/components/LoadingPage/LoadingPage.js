// @flow

import * as React from 'react';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const LoadingPage = () => (
  <View style={styles.page}>
    Loading...
  </View>
);

export default LoadingPage;
