import * as React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { Redirect } from 'react-router-native';

import { createPlayer, login } from '../../services/auth-service';

import Button, { ButtonsGroup } from '../../components/Button';
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
    nick: '',
  };

  async login(nick) {
    // pas l'temps d'niaiser
    if (nick.length === 0)
      nick = 'nils';

    const { res, json } = await login(nick.trim());

    if (res.status === 200)
      this.props.setPlayer(json, () => this.redirect(json));
    else
      this.props.onError('login', json);
  }

  async createPlayer(nick) {
    if (nick.length === 0)
      nick = 'nils';

    const { res, json } = await createPlayer(nick.trim());

    if (res.status === 201)
      this.props.setPlayer(json, () => this.redirect(json));
    else
      this.props.onError('createPlayer', json);
  }

  redirect(player) {
    const { history } = this.props;
    const location = player.gameId ? '/game/' + player.gameId : '/lobby';

    history.replace(location);
  }

  render() {
    const { nick } = this.state;

    return (
      <View style={[screen.view, screen.viewPadding]}>
        <Text style={screen.title}>Log in</Text>

        <TextInput
          style={styles.input}
          value={nick}
          placeholder="nick"
          onChangeText={nick => this.setState({ nick })}
          onSubmitEditing={() => this.login(nick)}
        />

        <ButtonsGroup>
          <Button title="create account" onPress={() => this.createPlayer(nick) } />
          <Button primary title="log in" onPress={() => this.login(nick) } />
        </ButtonsGroup>

      </View>
    );
  }

}
