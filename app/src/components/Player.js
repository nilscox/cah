import * as React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

import { playerAvatarUri } from '../services/player-service';


const styles = StyleSheet.create({
  player: {},
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  nick: {
    textAlign: 'center',
  },
});

const Player = ({ style, player }) => (
  <View style={[styles.player, style]}>
    <Image style={styles.avatar} source={playerAvatarUri(player)} />
    <Text style={styles.nick}>{ player.nick }</Text>
  </View>
);

export default Player;
