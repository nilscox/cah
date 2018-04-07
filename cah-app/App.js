import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Font } from 'expo';
import { YellowBox } from 'react-native';

import LoginScreen from './src/screens/LoginScreen';

YellowBox.ignoreWarnings([
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps is deprecated',
]);

export default class App extends React.Component {

  state = {
    loading: true,
  };

  async componentDidMount() {
    await Font.loadAsync({
      'oxygen': require('./assets/fonts/Oxygen/Oxygen-Regular.ttf'),
      'oxygen--bold': require('./assets/fonts/Oxygen/Oxygen-Bold.ttf'),
      'roboto-mono': require('./assets/fonts/Roboto_Mono/RobotoMono-Regular.ttf'),
      'luckiest-guy': require('./assets/fonts/Luckiest_Guy/LuckiestGuy-Regular.ttf'),
    });

    this.setState({ loading: false });
  }

  render() {
    const { loading } = this.state;

    if (loading)
      return <View />;

    return (
      <View style={styles.container}>
        <LoginScreen />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});
