import * as React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Redirect } from 'react-router-native';

import { createPlayer, login } from '../../services/auth-service';

import screen from '../screen.styles';


const styles = StyleSheet.create({
  input: {
     height: 40,
     borderColor: 'gray',
     borderBottomWidth: 1,
  },
  loginBtnText: {
    fontWeight: 'bold',
  },
});

export default class AuthScreen extends React.Component {

  state = {
    player: null,
    nick: '',
  };

  async login(nick) {
    const { res, json } = await login(nick.trim());

    if (res.status === 200) {
      this.props.setPlayer(json);
      this.setState({ player: json });
    }
    else
      console.log(json);
  }

  async createPlayer(nick) {
    const { res, json } = await createPlayer(nick.trim());

    if (res.status === 201) {
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
      <View style={screen.view}>
        <Text style={screen.title}>Log in</Text>

        <TextInput
          style={styles.input}
          value={nick}
          placeholder="nick"
          onChangeText={nick => this.setState({ nick })}
          onSubmitEditing={() => this.login(nick)}
        />

        <View style={screen.actions}>
          <TouchableOpacity onPress={() => this.createPlayer(nick)}>
            <Text>CREATE ACCOUNT</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.login(nick)}>
            <Text style={styles.loginBtnText}>LOG IN</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }

}
