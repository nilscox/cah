import * as React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

import { fetchPlayer } from '../../services/player-service';
import Loading from '../../components/Loading';
import Form, { FormField } from '../../components/Form';
import screen from '../screen.styles';


const API_URL = process.env.REACT_APP_API_URL;

const styles = StyleSheet.create({
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: '#CCC',
    alignSelf: 'center',
  },
  extra: {
    backgroundColor: '#EEE',
    borderColor: '#CCC',
    borderWidth: 1,
    marginVertical: 15,
    padding: 5,
  },
});

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

    const avatar = player.avatar
      ? { uri: API_URL + player.avatar }
      : require('./default-avatar.png');

    return (
      <View style={[screen.view, screen.viewPadding, styles.view]}>

        <Text style={screen.title}>{ player.nick }</Text>

        <Image style={styles.avatar} source={avatar} />

        <Form>
          <FormField label="Online">
            <Text>{ player.connected ? 'yes' : 'no' }</Text>
          </FormField>

          <FormField label="In-game">
            <Text>{ player.gameId ? 'yes' : 'no' }</Text>
          </FormField>
        </Form>

        { player.extra && (
          <View style={styles.extra}>
            <Text>{ player.extra }</Text>
          </View>
        ) }

      </View>
    );
  }

}
