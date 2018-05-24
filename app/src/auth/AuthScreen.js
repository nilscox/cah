// @flow

import * as React from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { connect } from 'react-redux';

import type { NavigationPropsType } from '~/types/navigation';
import type { Player } from '~/redux/state/player';
import { fetchPlayer, loginPlayer } from '~/redux/actions';

type StatePropsType = {
  player: ?Player,
};

type DispatchPropsType = {
  fetchPlayer: () => any,
  logIn: string => any,
  wsOpen: () => any,
  wsMessage: (any) => any,
  wsError: (any) => any,
  wsClose: (any) => any,
};

type AuthPropsType =
  & StatePropsType
  & NavigationPropsType
  & DispatchPropsType;

type AuthStateType = {
  nick: string,
};

const mapStateToProps = ({ player }) => ({
  player: player,
});

const mapDispatchToProps: Function => DispatchPropsType = dispatch => ({
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
    const { navigation } = this.props;

    this.props.fetchPlayer()
      .then(() => {
        if (this.props.player)
          navigation.navigate('Lobby');
      });
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
