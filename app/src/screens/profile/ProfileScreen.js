// @flow

import * as React from 'react';
import { View, Text, TextInput } from 'react-native';
import { connect } from 'react-redux';

import type { NavigationProps } from '~/types/navigation';
import type { Player } from '~/redux/state/player';
import PlayerAvatar from '~/components/PlayerAvatar';
import Button from '~/components/Button';

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
        {this.renderInfo()}
        <Button style={styles.saveButton} variant="big">Save</Button>
      </View>
    );
  }

  renderInfo() {
    const { player } = this.props;

    const info = (key, label, value, editable) => (
      <View key={`player-info-${key}`} style={styles.info}>
        <Text style={styles.label}>{label}:</Text>
        { editable
          ? <TextInput style={styles.valueReadWrite} value={value} />
          : <Text style={styles.valueReadOnly}>{value}</Text>
        }
      </View>
    );

    return (
      <View style={styles.playerInfos}>
        {info('nick', 'Nick', player.nick, true)}
        {player.score && info('score', 'Score', player.score)}
      </View>
    );
  }
}

export default connect(mapStateToProps)(ProfileScreen);
