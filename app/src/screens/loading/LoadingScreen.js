import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Redirect } from 'react-router-native';

import { fetchMe } from '../../services/player-service';

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
  state = {
    loading: true,
    player: null,
  };

  async componentDidMount() {
    const { res, json: player } = await fetchMe();

    if (res.status === 200)
      this.setState({ player });

    // like a shit load of stuff are loading... lol
    setTimeout(() => this.setState({ loading: false }), 4000);
  }

  render() {
    const { loading, player } = this.state;

    if (!loading)
      return <Redirect to={ player ? '/lobby' : '/auth' } />;

    return (
      <View style={styles.view}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }
}
