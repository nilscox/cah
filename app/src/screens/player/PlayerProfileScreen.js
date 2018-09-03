import * as React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

import { playerAvatarUri } from '../../services/player-service';
import Form, { FormField } from '../../components/Form';
import { ButtonPosition } from '../../components/Button';
import screen from '../screen.styles';


const styles = StyleSheet.create({
  avatar: {
    width: 160,
    height: 160,
    borderWidth: 1,
    borderColor: '#CCC',
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  extra: {
    backgroundColor: '#EEE',
    borderColor: '#CCC',
    borderWidth: 1,
    marginVertical: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

const PlayerProfileScreen = ({ player: me, location, history }) => {
  const { player } = location.state;

  return (
    <View style={[screen.view, screen.viewPadding, styles.view]}>

      <Text style={screen.title}>{ player.nick }</Text>

      <Image style={styles.avatar} source={playerAvatarUri(player)} />

      <Form>
        <FormField label="Online">
          <Text>{ player.connected ? 'yes' : 'no' }</Text>
        </FormField>

        <FormField label="In-game">
          <Text>{ player.gameId ? 'yes' : 'no' }</Text>
        </FormField>
      </Form>

      { player.extra !== null && (
        <View style={styles.extra}>
          <Text>{ player.extra }</Text>
        </View>
      ) }

      { player.nick === me.nick && (
        <ButtonPosition
          position="bottom"
          primary
          title="edit"
          onPress={() => history.push('/player/edit', { player })}
        />
      ) }

    </View>
  );
};

export default PlayerProfileScreen;
