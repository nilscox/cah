import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Redirect } from 'react-router-native';

import screen from '../../screen.styles';


const styles = StyleSheet.create({
  thankYou: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 30,
  },
  backBtn: {
    alignItems: 'center',
  },
});

export default class GameFinished extends React.Component {

  state = {
    back: false,
  };

  render() {
    const { game } = this.props;

    if (this.state.back)
      return <Redirect to="/lobby" />;

    return (
      <View style={screen.view}>

        <Text style={screen.title}>Game #{game.id} finished</Text>
        <Text style={styles.thankYou}>Thank you for playing!</Text>

        <TouchableOpacity style={styles.backBtn} onPress={() => this.setState({ back: true })}>
          <Text>BACK</Text>
        </TouchableOpacity>

      </View>
    );
  }

}
