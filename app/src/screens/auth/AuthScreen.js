import * as React from 'react';
import { View, Text } from 'react-native';
import { Redirect } from 'react-router-native';

import { login } from '../../services/auth-service';


export default class AuthScreen extends React.Component {

  state = {
    player: null,
  };

  async componentDidMount() {
    const { res, json } = await login('nils');

    if (res.status === 200)
      this.setState({ player: json });
    else
      console.log(json);
  }

  render() {
    const { player } = this.state;

    if (player)
      return <Redirect to={ player.gameId ? '/game/' + player.gameId : '/lobby' } />;

    return (
      <View>
        <Text>auth</Text>
      </View>
    );
  }

}
