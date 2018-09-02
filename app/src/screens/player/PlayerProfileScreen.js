import * as React from 'react';
import { View, Text } from 'react-native';

import { fetchPlayer } from '../../services/player-service';
import Loading from '../../components/Loading';
import screen from '../screen.styles';

export default class PlayerProfileScreen extends React.Component {

  state = {
    player: null,
  };

  async componentDidMount() {
    const { match } = this.props;
    const { res, json } = await fetchPlayer(match.params.nick);

    if (res.status === 200)
      this.setState({ player: json });
    else
      console.log(json);
  }

  render() {
    const { player } = this.state;

    if (!player)
      return <Loading />;

    return (
      <View>
        <Text style={screen.title}>{ player.nick }</Text>
      </View>
    );
  }

}
