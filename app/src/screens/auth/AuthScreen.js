import * as React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Redirect } from 'react-router-native';

import { login } from '../../services/auth-service';


const styles = StyleSheet.create({
  input: {
     height: 40,
     borderColor: 'gray',
     borderBottomWidth: 1,
  },
});

export default class AuthScreen extends React.Component {

  state = {
    player: null,
    nick: '',
  };

  async login(nick) {
    const { res, json } = await login(nick);

    if (res.status === 200) {
      this.props.setPlayer(json);
      this.setState({ player: json });
    }
    else
      console.log(json);
  }

  render() {
    const { player, nick } = this.state;

    if (player)
      return <Redirect to={ player.gameId ? '/game/' + player.gameId : '/lobby' } />;

    return (
      <View>
        <TextInput
          style={styles.input}
          value={nick}
          onChangeText={nick => this.setState({ nick })}
        />
        <TouchableOpacity onPress={() => this.login(nick)}>
          <Text>LOG IN</Text>
        </TouchableOpacity>
      </View>
    );
  }

}
