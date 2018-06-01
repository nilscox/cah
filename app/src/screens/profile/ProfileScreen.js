// @flow

import * as React from 'react';
import { View, Text, TextInput } from 'react-native';
import { connect } from 'react-redux';

import type { NavigationProps } from '~/types/navigation';
import type { Player } from '~/redux/state/player';
import { updatePlayer } from '~/redux/actions/player';
import PlayerAvatar from '~/components/PlayerAvatar';
import Button from '~/components/Button';

import styles from './ProfileScreen.styles';

type ProfileScreenProps =
  & { player: Player }
  & { updatePlayer: Function }
  & NavigationProps;

type ProfileScreenState = {
  nick: string,
};

const mapStateToProps = ({ player }) => ({
  player,
});

const mapDispatchToProps = (dispatch) => ({
  updatePlayer: (player) => dispatch(updatePlayer(player)),
});

class ProfileScreen extends React.Component<ProfileScreenProps, ProfileScreenState> {
  static navigationOptions = {
    headerTitle: 'My profile',
  };

  static getDerivedStateFromProps(nextProps) {
    const { player } = nextProps;

    return {
      nick: player.nick,
    };
  }

  handleSave = () => {
    const { updatePlayer } = this.props;
    const { nick } = this.state;

    updatePlayer({
      nick,
    });
  };

  render() {
    const { player } = this.props;

    return (
      <View style={styles.wrapper}>
        <PlayerAvatar style={styles.avatar} player={player} size="big" />
        {this.renderInfo()}
        <Button style={styles.saveButton} variant="big" onPress={this.handleSave}>Save</Button>
      </View>
    );
  }

  renderInfo() {
    const { player } = this.props;

    const info = (key, label, value, editable) => {
      const handleInfoChange = (text) => this.setState({ [key]: text });

      const input = (
        <TextInput
          style={styles.valueReadWrite}
          defaultValue={value}
          onChangeText={handleInfoChange}
        />
      );

      return (
        <View key={`player-info-${key}`} style={styles.info}>
          <Text style={styles.label}>{label}:</Text>
          { editable
            ? input
            : <Text style={styles.valueReadOnly}>{value}</Text>
          }
        </View>
      );
    }

    return (
      <View style={styles.playerInfos}>
        {info('nick', 'Nick', player.nick, true)}
        {player.score && info('score', 'Score', player.score)}
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
