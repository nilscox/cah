// @flow

import * as React from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { connect } from 'react-redux';

import type { NavigationPropsType } from '../types/navigation';
import type { Dispatch } from '../types/actions';
import type { Player } from '../types/player';
import type { State } from './reducer';
import { fetchPlayer, loginPlayer } from './actions';

type StatePropsType = {
  player: ?Player,
};

type DispatchPropsType = {
  fetchPlayer: () => any,
  logIn: string => any,
};

type AuthPropsType =
  & StatePropsType
  & NavigationPropsType
  & DispatchPropsType;

type AuthStateType = {
  nick: string,
};

const mapStateToProps: ({ auth: State }) => StatePropsType = ({ auth }) => ({
  player: auth.player,
});

const mapDispatchToProps: Dispatch => DispatchPropsType = dispatch => ({
  fetchPlayer: () => dispatch(fetchPlayer()),
  logIn: nick => dispatch(loginPlayer(nick)),
});

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  title: {
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 24,
    textAlign: 'center',
  },
  form: {
    flex: 2,
    marginHorizontal: 40,
  },
  nickInput: {
    borderColor: 'gray',
    borderBottomWidth: 1,
  },
  logInButton: {
    marginTop: 20,
  },
});

class AuthScreen extends React.Component<AuthPropsType, AuthStateType> {
  state = {
    nick: '',
  };

  onLogIn = () => {
    const { logIn } = this.props;
    const { nick } = this.state;

    logIn(nick.trim());
  };

  componentDidMount() {
    this.props.fetchPlayer();
  }

  componentDidUpdate() {
    const { player, navigation } = this.props;

    if (player)
      navigation.navigate('Lobby');
  }

  render() {
    return (
      <View style={styles.page}>

        <View style={styles.title}>
          <Text style={styles.titleText}>CAH</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.nickInput}
            underlineColorAndroid="transparent"
            placeholder="Your nick..."
            value={this.state.nick}
            onChangeText={text => this.setState({ nick: text })}
          />
          <View style={styles.logInButton}>
            <Button title="Log in" onPress={this.onLogIn} />
          </View>
        </View>

      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);
