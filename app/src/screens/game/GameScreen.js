import * as React from 'react';
import { View, Text } from 'react-native';
import { Redirect } from 'react-router-native';

import { fetchGame } from '../../services/game-service';

import Loading from '../../components/Loading';


export default class GameScreen extends React.Component {

  state = {
    game: null,
  };

  async componentDidMount() {
    const { params } = this.props.match;
    const { res, json } = await fetchGame(params.id);

    if (res.status === 200)
      this.setState({ game: json });
    else
      console.log(json);
  }

  render() {
    return (
      <View>
        <Text>game</Text>
        <Text>{ JSON.stringify(this.state.game) }</Text>
      </View>
    );
  }

}
