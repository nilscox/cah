import * as React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';

const mapStateToProps = ({ player }) => ({
  player,
});

const ProfileScreen = ({ player }) => (
  <View>
    <Text>ProfileScreen</Text>
    <Text>{JSON.stringify(player)}</Text>
  </View>
);

export default connect(mapStateToProps)(ProfileScreen);
