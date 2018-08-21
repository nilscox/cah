import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';


const styles = StyleSheet.create({
  view: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  text: {
    textAlign: 'center',
  },
});

export default class LoadingScreen extends React.Component {

  render() {
    return (
      <View style={styles.view}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

}
