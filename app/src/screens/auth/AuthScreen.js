import * as React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Redirect } from 'react-router-native';

import { createPlayer, login } from '../../services/auth-service';


const styles = StyleSheet.create({
  view: {
    paddingHorizontal: 30,
  },
  title: {
    textAlign: 'center',
    fontSize: 25,
    marginVertical: 30,
  },
  input: {
     height: 40,
     borderColor: 'gray',
     borderBottomWidth: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
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
      <View style={styles.view}>
        <Text style={styles.title}>Log in</Text>
        <TextInput
          style={styles.input}
          value={nick}
          placeholder="nick"
          onChangeText={nick => this.setState({ nick })}
          onSubmitEditing={() => this.login(nick)}
        />

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => this.createPlayer(nick)}>
            <Text>CRAETE ACCOUNT</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.login(nick)}>
            <Text style={styles.loginBtnText}>LOG IN</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }

}
