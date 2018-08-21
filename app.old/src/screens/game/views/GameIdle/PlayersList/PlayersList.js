// @flow

import * as React from 'react';
import { View } from 'react-native';

import type { Player } from '~/redux/state/player';
import PlayerAvatar from '~/components/PlayerAvatar';

import styles from './PlayersList.styles';

type PlayersListProps = {
  players: Array<Player>
};

const PlayersList = ({ players }: PlayersListProps) => (
  <View style={styles.wrapper}>
    { players.map((player) => (
      <PlayerAvatar
        key={`players-list-${player.nick}`}
        style={styles.playerAvatar}
        player={player}
        size="small"
      />
    )) }
  </View>
);

export default PlayersList;
