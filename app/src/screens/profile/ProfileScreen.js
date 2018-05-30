// @flow

import * as React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';

import type { NavigationProps } from '~/types/navigation';
import type { Player } from '~/redux/state/player';
import PlayerAvatar from '~/components/PlayerAvatar';

import styles from './ProfileScreen.styles';

type ProfileScreenProps =
  & { player: Player }
  & NavigationProps;

const mapStateToProps = ({ player }) => ({
  player,
});

class ProfileScreen extends React.Component<ProfileScreenProps> {
  static navigationOptions = {
    headerTitle: 'My profile',
  };

  render() {
    const { player } = this.props;

    return (
      <View style={styles.wrapper}>
        <PlayerAvatar style={styles.avatar} player={player} size="big" />

        <View style={styles.playerInfos}>
          {[
            ['Nick', player.nick],
            ['Score', player.score]
          ].map(([label, value]) => this.renderInfo(label, value))}
        </View>

      </View>
    );
  }

  renderInfo(label, value) {
    return (
      <View key={`player-info-${label}`} style={styles.info}>
        <Text style={styles.label}>{label}:</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    );
  }
}

export default connect(mapStateToProps)(ProfileScreen);
