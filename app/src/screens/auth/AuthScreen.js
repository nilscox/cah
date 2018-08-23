import * as React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { Redirect } from 'react-router-native';

import { login } from '../../services/auth-service';


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
      <View style={styles.view}>
        <Text style={styles.title}>Log in</Text>
        <TextInput
          style={styles.input}
          value={nick}
          placeholder="nick"
          onChangeText={nick => this.setState({ nick })}
          onSubmitEditing={() => this.login(nick)}
        />
      </View>
    );
  }

}
