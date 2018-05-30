// @flow

import * as React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';

import type { NavigationPropsType } from '~/types/navigation';
import PlayerAvatar from '~/components/PlayerAvatar';

type ProfileScreenProps = NavigationPropsType;

const mapStateToProps = ({ player }) => ({
  player,
});

class ProfileScreen extends React.Component<ProfileScreenProps> {
  static navigationOptions = ({ navigation }) => {
    const player = navigation.getParam('player');

    return {
      headerTitle: `${player.nick}'s profile`,
    };
  };

  render() {
    const { navigation } = this.props;
    const player = navigation.getParam('player');

    return (
      <View>
        <Text>ProfileScreen</Text>
        <PlayerAvatar player={player} />
        <Text>{JSON.stringify(player)}</Text>
      </View>
    );
  }
}

export default connect(mapStateToProps)(ProfileScreen);
